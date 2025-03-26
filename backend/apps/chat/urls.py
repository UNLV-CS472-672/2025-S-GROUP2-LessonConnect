# urls.py
from django.urls import path
from .views import select_send_message, send_message, chat_list, chat_detail

urlpatterns = [
  path('', chat_list, name='chat_list'),
  path('<int:chat_id>/', chat_detail, name='chat_detail'),
  path('send/', select_send_message, name='select_send_message'),
  path('send/<int:user_id>/', send_message, name='send_message'),
]

