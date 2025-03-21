import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()


class NotificationConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = None
        self.user = None

    async def connect(self):
        self.user = self.scope['user']

        # debug information
        print(f"WebSocket connection attempt from user: {self.user}")
        print(f"User authenticated: {self.user.is_authenticated}")
        print(f"User session: {self.scope.get('session', 'No session')}")

        # for now, accept all connections but set different groups
        if not self.user.is_authenticated:
            print("WARNING: Anonymous user connecting, allowing for testing only")
            self.room_group_name = 'notifications_anonymous'
        else:
            print(f"Authenticated user connecting: {self.user.username}, ID: {self.user.id}")
            self.room_group_name = f'notifications_{self.user.id}'

        # create a unique group name for this user
        self.room_group_name = f'notifications_{self.user.id}'
        print(f"Setting group name: {self.room_group_name}")

        # join the group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"WebSocket connection accepted for user {self.user}")

    async def disconnect(self, close_code):
        # leave the group when disconnecting
        if hasattr(self, 'room_group_name') and self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    # handles incoming messages from WebSocket
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            command = data.get('command')

            if command == 'mark_as_read':
                notification_id = data.get('id')
                if notification_id:
                    success = await self.mark_notification_as_read(notification_id)
                    await self.send(text_data=json.dumps({
                        'status': 'success' if success else 'error',
                        'message': f'Notification {notification_id} marked as read' if success else 'Failed to mark notification as read'
                    }))

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'status': 'error',
                'message': 'Invalid JSON'
            }))

    # this method receives notifications from the notification_event
    async def notification_event(self, event):
        # send the notification data to the WebSocket
        await self.send(text_data=json.dumps(event['data']))

    @database_sync_to_async
    def mark_notification_as_read(self, notification_id):
        from .models import Notification
        try:
            notification = Notification.objects.get(id=notification_id, user=self.user)
            notification.mark_as_read()
            return True
        except Notification.DoesNotExist:
            return False
