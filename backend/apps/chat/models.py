from django.db import models
from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

class Chat(models.Model):
  user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chats_initiated")
  user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chats_received")
  createdAt = models.DateTimeField(auto_now_add=True)
  updatedAt = models.DateTimeField(auto_now=True)
  name = models.CharField(max_length=100, default="Unknown")

  class Meta:
    unique_together = ('user1', 'user2')
    ordering = ['-updatedAt']

  def __str__(self):
    return f"Chat between {self.user1} and {self.user2}"

  @classmethod
  def get_or_create_chat(cls, user1, user2):
    """Ensure consistent ordering of users in the chat model."""
    if user1.id > user2.id:
      user1, user2 = user2, user1
    chat, created = cls.objects.get_or_create(user1=user1, user2=user2)
    return chat

# https://www.youtube.com/watch?v=Rv6gkYcN88Q
class Message(models.Model):
  SEEN = 1
  NOT_SEEN = 2
  NOT_SENT = 3
  STATUS_CHOICES = (
    (SEEN, 'Seen'),
    (NOT_SEEN, 'Not seen'),
    (NOT_SENT, 'Not sent'),
  )
  chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
  status = models.PositiveSmallIntegerField(choices=STATUS_CHOICES, null=False, blank=False, default=NOT_SEEN)
  sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
  content = models.TextField()
  timestamp = models.DateTimeField(default=now)

  class Meta:
      ordering = ['timestamp']

  def __str__(self):
    return f"From {self.sender} in Chat {self.chat.id} at {self.timestamp}"

  def save(self, *args, **kwargs):
    """Update the chat's updatedAt field whenever a new message is saved."""
    self.chat.updatedAt = now()
    self.chat.save()
    super().save(*args, **kwargs)

