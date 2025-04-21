from django.contrib.auth.models import User
from .models import Chat, Message
from django.contrib.auth import get_user_model
from .consumers import ChatConsumer
from channels.testing import WebsocketCommunicator
from django.conf import settings
from backend.asgi import application
from apps.users.models import Profile
from rest_framework_simplejwt.tokens import RefreshToken
import pytest
import json

@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True)
class TestChatWebsockets:
    @pytest.fixture(autouse=True)
    def setup(self, db):
        self.user1 = get_user_model().objects.create_user(
            username='testuser1',
            password='password',
            first_name='John',
            last_name='Doe',
            email='testuser1@example.com'
        )
        self.profile1 = Profile.objects.create(user=self.user1, role=2)
        self.token1 = self.get_jwt_token(self.user1)

        self.user2 = get_user_model().objects.create_user(
            username='testuser2',
            password='password',
            first_name='Jane',
            last_name='Doe',
            email='testuser2@example.com'
        )
        self.profile2 = Profile.objects.create(user=self.user2, role=2)
        self.token2 = self.get_jwt_token(self.user2)

        # Create test chat
        self.chat, _ = Chat.objects.get_or_create_chat(self.user1, self.user2)
        self.chat.name = "room1"
        self.chat.save()

        # Create test messages
        self.message1 = Message.objects.create(
            chat=self.chat,
            sender=self.user1,
            content="Test message 1 for chat",
            status=Message.NOT_SEEN
        )
        self.message2 = Message.objects.create(
            chat=self.chat,
            sender=self.user1,
            content="Test message 2 for chat",
            status=Message.NOT_SEEN
        )

    def get_jwt_token(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def setup_communicator(self, room_name, token):
        return WebsocketCommunicator(
            application,
            f"/ws/apps/chat/{room_name}/",
            subprotocols=["chat", token],
        )

    async def test_websocket_connection(self):
        communicator = self.setup_communicator("room1", self.token1)
        connected, _ = await communicator.connect()
        assert connected

        await communicator.send_to(text_data=json.dumps({"message": "ping"}))
        response = await communicator.receive_from()
        data = json.loads(response)

        assert data["message"] == "successful"
        assert data["body"] == "ping"

        await communicator.disconnect()

    async def test_websocket_typing_status(self):
        communicator = self.setup_communicator("room1", self.token1)
        connected, _ = await communicator.connect()
        assert connected

        await communicator.send_to(text_data=json.dumps({"typing": True}))
        response = await communicator.receive_from()
        data = json.loads(response)

        assert data["message"] == "successful"
        assert data["typing"] is True
        assert data["username"] == self.user1.username

        await communicator.disconnect()

    async def test_websocket_seen_status(self):
        communicator = self.setup_communicator("room1", self.token2) # User who sees the text
        connected, _ = await communicator.connect()
        assert connected

        seen_ids = [self.message1.id, self.message2.id]
        await communicator.send_to(text_data=json.dumps({"seen": seen_ids}))
        response = await communicator.receive_from()
        data = json.loads(response)

        assert data["message"] == "seen_successful"
        assert sorted(data["ids"]) == sorted(seen_ids)
        assert data["username"] == self.user1.username

        await communicator.disconnect()
