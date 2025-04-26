from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from .managers import ChatManager, MessageManager

class Chat(models.Model):
  user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chats_initiated")
  user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chats_received")
  createdAt = models.DateTimeField(auto_now_add=True)
  updatedAt = models.DateTimeField(auto_now=True)
  name = models.CharField(max_length=100, default="Unknown")

  objects = ChatManager()

  class Meta:
    unique_together = ('user1', 'user2')
    ordering = ['-updatedAt']

  def __str__(self):
    return f"Chat between {self.user1} and {self.user2}"

class Message(models.Model):
  chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
  sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
  content = models.TextField()
  timestamp = models.DateTimeField(default=now)

  objects = MessageManager()

  class Meta:
    ordering = ['timestamp']

  def __str__(self):
    return f"From {self.sender} in Chat {self.chat.id} at {self.timestamp}"

