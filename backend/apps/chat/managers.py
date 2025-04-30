from django.db import models
from django.utils.timezone import now

# https://chatgpt.com/share/67fda93c-b758-8005-b5d1-56978a0bda6e
class ChatManager(models.Manager):
    def get_or_create_chat(self, user1, user2):
        """Ensure consistent ordering of users in the chat model."""
        if user1.id > user2.id:
            user1, user2 = user2, user1
        chat, created = self.get_or_create(user1=user1, user2=user2)
        return chat, created
    
    def get_other_user(self, chat, user):
        return chat.user2 if chat.user1 == user else chat.user1
    
    def user_blocked_or_muted(self, chat, sender):
        receiver = self.get_other_user(chat, sender)
        from .models import BlockedUser, MutedUser # avoid circular import

        if BlockedUser.objects.filter(blocked_by=receiver.profile, blocked_user=sender.profile).exists():
            raise PermissionError("You are blocked by this user.")

        if MutedUser.objects.filter(muted_by=receiver.profile,  muted_user=sender.profile).exists():
            raise PermissionError("You are muted by this user.")

class MessageManager(models.Manager):
    def create_message(self, chat, sender, content):
        """Create a new message and update the chat's updatedAt field."""
        # Create the message
        message = self.create(chat=chat, sender=sender, content=content)
        
        # Update the chat's updatedAt field
        chat.updatedAt = now()
        chat.save()

        return message
