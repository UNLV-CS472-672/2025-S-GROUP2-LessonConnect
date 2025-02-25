# The below code is just for testing purposes (it works!)
# Tested it using https://websocketking.com/
# and entered ws://localhost:8000/ws/apps/chat/practice/
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class PracticeConsumer(AsyncJsonWebsocketConsumer):
      async def connect(self):
           await self.accept()

      async def receive(self, text_data=None, bytes_data=None, **kwargs):
            if text_data == 'PING':
                # Send back a response
                await self.send(text_data='{"message": "PONG"}')