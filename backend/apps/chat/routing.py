from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/apps/chat/(?P<room_name>[\w-]+)/$", consumers.ChatConsumer.as_asgi()),
    #re_path(r"ws/apps/chat/(?P<room_name>[a-zA-Z0-9-]+)/$", consumers.ChatConsumer.as_asgi()),
    #re_path(r"ws/chat/(?P<room_name>\w+)/$", consumers.ChatConsumer.as_asgi())
    #re_path(r'ws/apps/chat/$', consumers.ChatConsumer.as_asgi()),
    #re_path(r'ws/apps/chat/practice/$', consumers.PracticeConsumer.as_asgi()),
]