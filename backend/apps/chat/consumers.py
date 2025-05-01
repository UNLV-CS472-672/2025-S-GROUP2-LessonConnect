import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message, Chat, BlockedUser, MutedUser
from django.contrib.auth.models import User
from channels.db import database_sync_to_async

# https://medium.com/@farad.dev/how-to-build-a-real-time-chat-app-using-django-channels-2ba2621ea972
class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user_id = self.scope.get('user_id')
        if user_id is not None:
            self.user_id = user_id
            self.room_name = self.scope["url_route"]["kwargs"]["room_name"]  # Extracts the room_name from the URL
            self.room_group_name = f'chat_{self.room_name}'

            await self.channel_layer.group_add(  # Adds the WebSocket connection (client) to a channel group
                self.room_group_name,
                self.channel_name
            )
            await self.accept("chat") # Returns protocol back to browser (DO NOT DELETE)


    async def disconnect(self, close_code):
        print(f"Disconnected! Code: {close_code}")
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    @database_sync_to_async
    def user_blocked_or_muted(self, chat, sender):
        Chat.objects.user_blocked_or_muted(chat, sender)

# This function receive messages from WebSocket.
    async def receive(self, text_data):
        # Message is received
        text_data_json = json.loads(text_data)
        if 'message' in text_data_json:
            message = text_data_json['message']

            try:
                chat = await sync_to_async(Chat.objects.get)(name=self.room_name)
                sender = await sync_to_async(User.objects.get)(id=self.user_id)
                await self.user_blocked_or_muted(chat, sender)

                # Try to save the message
                username, id, timestamp = await self.save_message(self.user_id, self.room_name, message)

                # Serialize timestamp
                formatted = timestamp.isoformat()

                await self.channel_layer.group_send( # sends message to all users in a channel group
                    self.room_group_name,
                    {
                        'type': 'chat_message', # Calls chat_message()
                        'message': message,
                        'username': username,
                        'id': id,
                        'timestamp': formatted
                    }
                )
            except Chat.DoesNotExist:
                # Handle the error: chat room does not exist
                print(f"Chat room '{self.room_name}' not found. Message not saved.")
                # Send an error message back to the user
                await self.send(text_data=json.dumps({
                    "error": f"Chat room '{self.room_name}' not found. Message not saved."
                }))

        # Typing status is received
        elif 'typing' in text_data_json:
            typing = text_data_json['typing']
            username = await self.get_username(self.user_id)
            await self.channel_layer.group_send( # sends message to all users in a channel group
                self.room_group_name,
                {
                    'type': 'typing_status', # Calls typing_status()
                    'typing': typing,
                    'username': username
                }
            )
        # Seen status is received
        elif 'seen' in text_data_json:
            sender_username, message_ids = await self.mark_as_seen(self.room_name, self.user_id)

            await self.channel_layer.group_send( # sends message to all users in a channel group
                self.room_group_name,
                {
                    'type': 'seen_status', # Calls seen_status()
                    'username': sender_username,
                    'ids': message_ids
                }
            )

    @sync_to_async
    def mark_as_seen(self, room_name, user_id):
        chat = Chat.objects.get(name = room_name)
        # Get all unseen messages (excluding those from the receiver)
        unseen_messages = chat.messages.filter(status=Message.NOT_SEEN).exclude(sender_id=user_id).order_by('-timestamp')

        # Get sender (assumes all chats only have 2 people)
        first_unseen = unseen_messages.first()
        sender_username = None

        # If there are unseen messages from sender
        if first_unseen:
            sender_username = first_unseen.sender.username

        # Get message ids (maintaining order)
        message_ids = list(unseen_messages.values_list('id', flat=True))

        # Mark unseen messages as seen
        unseen_messages.update(status=Message.SEEN)

        return sender_username, message_ids


    async def seen_status(self, event):
        await self.send(text_data=json.dumps({
            'message': 'seen_successful',
            'ids': event['ids'],
            'username': event['username']
        }))

    async def typing_status(self, event):
        await self.send(text_data=json.dumps({
            'message': 'successful',
            'typing': event['typing'],
            'username': event['username']
        }))

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': 'successful',
            'body': event['message'],
            'username': event['username'],
            'id': event['id'],
            'timestamp': event['timestamp']
        }))

    @sync_to_async
    def get_username(self, id):
        user = User.objects.get(id=id)
        return user.username

    @sync_to_async
    def save_message(self, id, room_name, content):
        user = User.objects.get(id=id)
        chat = Chat.objects.get(name=room_name)
        message = Message.objects.create(content=content, chat=chat, sender=user)  # Creates and saves message
        return user.username, message.id, message.timestamp