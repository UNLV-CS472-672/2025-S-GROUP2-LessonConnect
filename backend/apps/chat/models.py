from django.db import models

from django.contrib.auth.models import User
from django.utils.timezone import now

class Message(models.Model):
  sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
  receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
  content = models.TextField()
  timestamp = models.DateTimeField(default=now)

  class Meta:
    ordering = ['-timestamp']

  def __str__(self):
    return f"From {self.sender} to {self.receiver} at {self.timestamp}"
