from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from .managers import ChatManager, MessageManager
from django.core.exceptions import ValidationError

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

  objects = MessageManager()

  class Meta:
      ordering = ['timestamp']

  def __str__(self):
    return f"From {self.sender} in Chat {self.chat.id} at {self.timestamp}"

class MutedUser(models.Model):
    muted_user = models.ForeignKey('users.Profile', related_name='got_muted', on_delete=models.CASCADE)
    muted_by = models.ForeignKey('users.Profile', related_name='muted_others', on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=now)

    class Meta:
        unique_together = ('muted_user', 'muted_by')
        verbose_name = "Muted User"
        verbose_name_plural = "Muted Users"
        ordering = ['-created_at']

    def clean(self):
        if self.muted_user == self.muted_by:
            raise ValidationError("You cannot mute yourself.")

    def __str__(self):
        return f"{self.muted_by} muted {self.muted_user}"

class BlockedUser(models.Model):
    blocked_user = models.ForeignKey('users.Profile', related_name='got_blocked', on_delete=models.CASCADE)
    blocked_by = models.ForeignKey('users.Profile', related_name='blocked_others', on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=now)

    class Meta:
        unique_together = ('blocked_user', 'blocked_by')
        verbose_name = "Blocked User"
        verbose_name_plural = "Blocked Users"
        ordering = ['-created_at']

    def clean(self):
        if self.blocked_user == self.blocked_by:
            raise ValidationError("You cannot block yourself.")
        
    def __str__(self):
        return f"{self.blocked_by} blocked {self.blocked_user}"

class ReportedUser(models.Model):
    reported_user = models.ForeignKey('users.Profile', related_name='got_reported', on_delete=models.CASCADE)
    reported_by = models.ForeignKey('users.Profile', related_name='reported_others', on_delete=models.CASCADE)
    reason = models.TextField()
    created_at = models.DateTimeField(default=now)

    class Meta:
        verbose_name = "Reported User"
        verbose_name_plural = "Reported Users"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reported_by} reported {self.reported_user}"

