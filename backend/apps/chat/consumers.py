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
            print("user_id is NOT none")
            self.user_id = user_id
            print(f'user id: {self.user_id}')
            self.room_name = self.scope["url_route"]["kwargs"]["room_name"]  # Extracts the room_name from the URL
            self.room_group_name = f'chat_{self.room_name}'
            print("we now do self.accept")



            #if self.is_error_exists():
             #   error = {
            #        'error': str(self.scope['error'])
            #    }
            #    await self.send(text_data=json.dumps(error))
            #    await self.close()

            #else:
                #print("group_add")
            await self.channel_layer.group_add(  # Adds the WebSocket connection (client) to a channel group
                self.room_group_name,
                self.channel_name
            )
            print(">>> About to accept connection")
            await self.accept("chat") # Returns protocol back to browser (DO NOT DELETE)
            print(">>> WebSocket connection accepted")
            # await self.send(text_data="Connected successfully.")


        else:
            print("User_id is none :c")


    async def disconnect(self, close_code):
        print(f"Disconnected! Code: {close_code}")
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f'room group name{self.room_group_name}')
        print(f'Websocket disconnected:{self.channel_name}')
# This function receive messages from WebSocket. 10:58
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Create a new message object
        await self.save_message(self.user_id, self.room_name, message)

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
    def save_message(self, id, room_name, content):
        try:
            user = User.objects.get(id=id)
            chat = Chat.objects.get(name = room_name)
            Message.objects.create(content=content, chat = chat, sender = user) # Creates and saves message
        except (Chat.DoesNotExist):
            print(f"Chat room '{room_name}' not found. Message not saved.")

   # def is_error_exists(self):
    #    """This checks if error exists during websockets"""
#
     #   return True if 'error' in self.scope else False