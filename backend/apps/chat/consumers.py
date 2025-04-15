# The below code is just for testing purposes (it works!)
# Tested it using https://websocketking.com/
# and entered ws://localhost:8000/ws/apps/chat/practice/
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message, Chat
from django.contrib.auth.models import User

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

# This function receive messages from WebSocket.
    async def receive(self, text_data):
        # Message is received
        text_data_json = json.loads(text_data)
        if 'message' in text_data_json:
            message = text_data_json['message']

            # Create a new message object
            username = await self.save_message(self.user_id, self.room_name, message)

            await self.channel_layer.group_send( # sends message to all users in a channel group
                self.room_group_name,
                {
                    'type': 'chat_message', # Calls chat_message()
                    'message': message,
                    'username': username
                }
            )

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
            seen = text_data_json['seen']
            await self.mark_as_seen(self.room_name)

    @sync_to_async
    def mark_as_seen(self, room_name):
        chat = Chat.objects.get(name = room_name)
        latest_message = chat.messages.order_by('-timestamp').first()
        if latest_message and latest_message.status == Message.NOT_SEEN:
            latest_message.status = Message.SEEN
            latest_message.save(update_fields=['status'])

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
            'username': event['username']
        }))

    @sync_to_async
    def get_username(self, id):
        user = User.objects.get(id=id)
        return user.username

    @sync_to_async
    def save_message(self, id, room_name, content):
        try:
            user = User.objects.get(id=id)
            chat = Chat.objects.get(name = room_name)
            Message.objects.create(content=content, chat = chat, sender = user) # Creates and saves message
            return user.username
        except (Chat.DoesNotExist):
            print(f"Chat room '{room_name}' not found. Message not saved.")
            return "Unknown"
