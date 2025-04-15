from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import Chat, Message

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
        Chat.get_or_create_chat(self.user1, self.user2)
        url = reverse('chat-list')
        data = {'user2': self.user2.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_user_chats(self):
        Chat.get_or_create_chat(self.user1, self.user2)
        Chat.get_or_create_chat(self.user1, self.user3)
        url = reverse('chat-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_send_message(self):
        chat, _ = Chat.get_or_create_chat(self.user1, self.user2)
        url = reverse('message-list')
        data = {'chat': chat.id, 'content': 'Hello Bob!'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.count(), 1)
        message = Message.objects.first()
        self.assertEqual(message.content, 'Hello Bob!')
        self.assertEqual(message.sender, self.user1)


    def test_list_chat_messages(self):
        chat, created = Chat.get_or_create_chat(self.user1, self.user2)
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
