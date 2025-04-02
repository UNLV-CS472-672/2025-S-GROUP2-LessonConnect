# The below code is just for testing purposes (it works!)
# Tested it using https://websocketking.com/
# and entered ws://localhost:8000/ws/apps/chat/practice/
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message, Chat

# https://medium.com/@farad.dev/how-to-build-a-real-time-chat-app-using-django-channels-2ba2621ea972
class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope["user"]  # Get the user from the scope

        #if not user.is_authenticated:
         #   print("not authenticated")
          #  return

        self.user = user
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]  # Extracts the room_name from the URL
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(  # Adds the WebSocket connection (client) to a channel group
            self.room_group_name,
            self.channel_name
        )
        await self.accept()


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
# This function receive messages from WebSocket. 10:58
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Create a new message object
        await self.save_message(self.user, self.room_name, message)

        await self.channel_layer.group_send( # sends message to all users in a channel group
            self.room_group_name,
            {
                'type': 'chat_message', # Calls chat_message()
                'message': message
            }
        )

    async def chat_message(self, event):
        message = event['message']
        #send message of sender to websocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    @sync_to_async
    def save_message(self, user, room_name, content):
        try:
            chat = Chat.objects.get(name = room_name)
            Message.objects.create(content=content, chat = chat, sender = user) # Creates and saves message
        except (Chat.DoesNotExist):
            print(f"Chat room '{room_name}' not found. Message not saved.")