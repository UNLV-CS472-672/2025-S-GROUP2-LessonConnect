# The below code is just for testing purposes (it works!)
# Tested it using https://websocketking.com/
# and entered ws://localhost:8000/ws/apps/chat/practice/
import json
from channels.generic.websocket import AsyncWebsocketConsumer

#class PracticeConsumer(AsyncJsonWebsocketConsumer):
#      async def connect(self):
#           await self.accept()
#
#      async def receive(self, text_data=None, bytes_data=None, **kwargs):
#            if text_data == 'PING':
#                # Send back a response
#                await self.send(text_data='{"message": "PONG"}')

# https://medium.com/@farad.dev/how-to-build-a-real-time-chat-app-using-django-channels-2ba2621ea972
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'chat_room'
        self.room_group_name = 'chat_%s' % self.room_name
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )
    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))