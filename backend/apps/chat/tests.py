from django.contrib.auth.models import User
from apps.users.models import Profile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.test import TestCase
from apps.chat.models import Chat, Message, MutedUser, BlockedUser, ReportedUser
from apps.chat.consumers import ChatConsumer
from django.utils.timezone import now
import time
from django.core.exceptions import ValidationError

def test_chat_consumer_init():
    consumer = ChatConsumer()
    assert consumer is not None

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

    def test_create_chat_missing_user2(self):
        url = reverse('chat-list')
        response = self.client.post(url, {})  # Missing "user2"
        self.assertEqual(response.status_code, 400)
        self.assertIn("user2", response.data)

    def test_create_chat_user2_not_found(self):
        url = reverse('chat-list')
        response = self.client.post(url, {"user2": 9999})  # non-existent ID
        self.assertEqual(response.status_code, 400)
        self.assertIn("user2", response.data)

    def test_create_chat_already_exists(self):
        Chat.objects.get_or_create_chat(self.user1, self.user2)
        url = reverse('chat-list')
        response = self.client.post(url, {"user2": self.user2.id})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Chat already exists", str(response.data))

    def test_get_messages_custom_action(self):
        chat, _ = Chat.objects.get_or_create_chat(self.user1, self.user2)
        Message.objects.create(chat=chat, sender=self.user1, content="Hello!")
        url = reverse('chat-messages', args=[chat.id])  # Must match router name
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['content'], "Hello!")

# https://chatgpt.com/share/681180bd-8930-800c-9f58-8f4de378d8e2
class ChatModelTests(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='alice', password='pass1234')
        self.user2 = User.objects.create_user(username='bob', password='pass1234')
        self.profile1 = Profile.objects.create(user=self.user1, role=1)
        self.profile2 = Profile.objects.create(user=self.user2, role=1)

    def test_chat_str(self):
        chat = Chat.objects.create(user1=self.user1, user2=self.user2)
        expected_str = f"Chat between {self.user1} and {self.user2}"
        self.assertEqual(str(chat), expected_str)

    def test_message_str(self):
        chat = Chat.objects.create(user1=self.user1, user2=self.user2)
        message = Message.objects.create(chat=chat, sender=self.user1, content="Hello!", timestamp=now())
        expected_str = f"From {self.user1} in Chat {chat.id} at {message.timestamp}"
        self.assertEqual(str(message), expected_str)

    def test_muted_user_str(self):
        muted = MutedUser.objects.create(muted_user=self.profile2, muted_by=self.profile1)
        expected_str = f"{self.profile1} muted {self.profile2}"
        self.assertEqual(str(muted), expected_str)

    def test_blocked_user_str(self):
        blocked = BlockedUser.objects.create(blocked_user=self.profile2, blocked_by=self.profile1)
        expected_str = f"{self.profile1} blocked {self.profile2}"
        self.assertEqual(str(blocked), expected_str)

    def test_reported_user_str(self):
        reported = ReportedUser.objects.create(reported_user=self.profile2, reported_by=self.profile1, reason="Spam")
        expected_str = f"{self.profile1} reported {self.profile2}"
        self.assertEqual(str(reported), expected_str)

    def test_muted_user_clean_valid(self):
        muted = MutedUser(muted_user=self.profile2, muted_by=self.profile1)
        muted.clean()  # Should not raise

    def test_muted_user_clean_invalid(self):
        muted = MutedUser(muted_user=self.profile1, muted_by=self.profile1)
        with self.assertRaises(ValidationError) as context:
            muted.clean()
        self.assertIn("You cannot mute yourself.", str(context.exception))

    def test_blocked_user_clean_valid(self):
        blocked = BlockedUser(blocked_user=self.profile2, blocked_by=self.profile1)
        blocked.clean()  # should not raise

    def test_blocked_user_clean_invalid(self):
        blocked = BlockedUser(blocked_user=self.profile1, blocked_by=self.profile1)
        with self.assertRaises(ValidationError) as context:
            blocked.clean()
        self.assertIn("You cannot block yourself.", str(context.exception))
    
class ChatManagerTests(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='alice', password='pass1234')
        self.user2 = User.objects.create_user(username='bob', password='pass1234')
        self.profile1 = Profile.objects.create(user=self.user1, role=1)
        self.profile2 = Profile.objects.create(user=self.user2, role=1)
        self.chat, _ = Chat.objects.get_or_create_chat(self.user1, self.user2)

    def test_get_or_create_chat_orders_users(self):
        Chat.objects.all().delete()
        chat1, created1 = Chat.objects.get_or_create_chat(self.user2, self.user1)
        self.assertTrue(created1)
        self.assertEqual(chat1.user1, min(self.user1, self.user2, key=lambda u: u.id))
        self.assertEqual(chat1.user2, max(self.user1, self.user2, key=lambda u: u.id))

        # should not create a new one
        chat2, created2 = Chat.objects.get_or_create_chat(self.user1, self.user2)
        self.assertFalse(created2)
        self.assertEqual(chat1.id, chat2.id)

    def test_get_other_user(self):
        chat, _ = Chat.objects.get_or_create_chat(self.user1, self.user2)
        self.assertEqual(Chat.objects.get_other_user(chat, self.user1), self.user2)
        self.assertEqual(Chat.objects.get_other_user(chat, self.user2), self.user1)

    def test_user_blocked_or_muted_blocked(self):
        chat, _ = Chat.objects.get_or_create_chat(self.user1, self.user2)
        BlockedUser.objects.create(blocked_by=self.profile2, blocked_user=self.profile1)

        with self.assertRaises(PermissionError) as ctx:
            Chat.objects.user_blocked_or_muted(chat, self.user1)
        self.assertIn("blocked", str(ctx.exception))

    def test_user_blocked_or_muted_muted(self):
        chat, _ = Chat.objects.get_or_create_chat(self.user1, self.user2)
        MutedUser.objects.create(muted_by=self.profile2, muted_user=self.profile1)

        with self.assertRaises(PermissionError) as ctx:
            Chat.objects.user_blocked_or_muted(chat, self.user1)
        self.assertIn("muted", str(ctx.exception))

    def test_create_message_and_update_timestamp(self):
        old_updated_at = self.chat.updatedAt
        time.sleep(0.01)  # Make sure timestamp will differ
        msg = Message.objects.create_message(chat=self.chat, sender=self.user1, content="hello!")
        
        self.chat.refresh_from_db()
        self.assertEqual(msg.content, "hello!")
        self.assertEqual(msg.chat, self.chat)
        self.assertGreater(self.chat.updatedAt, old_updated_at)

class MuteBlockReportAPITests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='alice', password='pass1234')
        self.user2 = User.objects.create_user(username='bob', password='pass1234')
        self.profile1 = Profile.objects.create(user=self.user1, role=1)
        self.profile2 = Profile.objects.create(user=self.user2, role=1)

        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)

    def test_mute_user(self):
        url = reverse('mute-list')
        payload = {"muted_user": self.profile2.id}
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MutedUser.objects.count(), 1)

    def test_duplicate_mute_user(self):
        MutedUser.objects.create(muted_user=self.profile2, muted_by=self.profile1)
        url = reverse('mute-list')
        payload = {"muted_user": self.profile2.id}
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_block_user(self):
        url = reverse('block-list')
        payload = {"blocked_user": self.profile2.id}
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BlockedUser.objects.count(), 1)

    def test_duplicate_block_user(self):
        BlockedUser.objects.create(blocked_user=self.profile2, blocked_by=self.profile1)
        url = reverse('block-list')
        payload = {"blocked_user": self.profile2.id}
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_report_user(self):
        url = reverse('report-list')
        payload = {
            "reported_user": self.profile2.id,
            "reason": "Spam"
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ReportedUser.objects.count(), 1)

    def test_list_blocked_users(self):
        BlockedUser.objects.create(blocked_user=self.profile2, blocked_by=self.profile1)
        url = reverse('block-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_reported_users(self):
        ReportedUser.objects.create(reported_user=self.profile2, reported_by=self.profile1, reason="Spam")
        url = reverse('report-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)