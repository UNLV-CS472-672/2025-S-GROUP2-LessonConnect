# urls.py
from django.urls import path, include
# from .views import select_send_message, send_message, chat_list, chat_detail
# https://chatgpt.com/share/67fd9c70-d378-8005-8c39-b0453f0f790f
from rest_framework.routers import DefaultRouter
from .views import ChatViewSet, MessageViewSet

router = DefaultRouter()
router.register(r'chats', ChatViewSet, basename='chat')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
  path('', include(router.urls)),
  # path('legacy/', chat_list, name='chat_list'),
  # path('<int:chat_id>/', chat_detail, name='chat_detail'),
  # path('send/', select_send_message, name='select_send_message'),
  # path('send/<int:user_id>/', send_message, name='send_message'),
]

