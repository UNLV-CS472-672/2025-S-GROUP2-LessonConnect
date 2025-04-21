from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
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

class ChatAPITestCase(APITestCase):

    def setUp(self):
        self.user1 = User.objects.create_user(username='alice', password='pass1234')
        self.user2 = User.objects.create_user(username='bob', password='pass1234')
        self.user3 = User.objects.create_user(username='charlie', password='pass1234')

        self.client = APIClient()
        # Obtain JWT tokens
        self.login_url = "/users/login/"
        response = self.client.post(self.login_url, {"username": "alice", "password": "pass1234"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.refresh_token = response.json().get("refreshToken")
        self.access_token = response.json().get("accessToken")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

    def test_create_chat(self):
        self.assertEqual(Chat.objects.count(), 0)
        url = reverse('chat-list')
        data = {'user2': self.user2.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Chat.objects.count(), 1)

    def test_prevent_duplicate_chat(self):
        Chat.objects.get_or_create_chat(self.user1, self.user2)
        url = reverse('chat-list')
        data = {'user2': self.user2.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_user_chats(self):
        Chat.objects.get_or_create_chat(self.user1, self.user2)
        Chat.objects.get_or_create_chat(self.user1, self.user3)
        url = reverse('chat-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        # ensure that the receivers match
        response_receiver_ids = {chat['user2']['id'] for chat in response.data}
        expected_receiver_ids = {self.user2.id, self.user3.id}
        self.assertSetEqual(response_receiver_ids, expected_receiver_ids)

    def test_send_message(self):
        chat, _ = Chat.objects.get_or_create_chat(self.user1, self.user2)
        url = reverse('message-list')
        data = {'chat': chat.id, 'content': 'Hello Bob!'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)
        message = Message.objects.first()
        self.assertEqual(message.content, 'Hello Bob!')
        self.assertEqual(message.sender, self.user1)


    def test_list_chat_messages(self):
        chat, created = Chat.objects.get_or_create_chat(self.user1, self.user2)
        Message.objects.create(chat=chat, sender=self.user1, content='Hi Bob!')
        Message.objects.create(chat=chat, sender=self.user2, content='Hey Alice!')

        url = reverse('chat-messages', kwargs={'pk': chat.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['content'], 'Hi Bob!')
        self.assertEqual(response.data[1]['content'], 'Hey Alice!')

    def test_unauthenticated_access(self):
        self.client.logout()
        url = reverse('chat-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

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

        self.chat, _ = Chat.objects.get_or_create_chat(self.user1, self.user2)
        self.chat.name = "room1"
        self.chat.save()

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