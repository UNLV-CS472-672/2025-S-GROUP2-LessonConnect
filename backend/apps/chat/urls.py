# urls.py
from django.urls import path
from .views import send_message, inbox

urlpatterns = [
  path('send/', send_message, name='send_message'),
  path('inbox/', inbox, name='inbox'),
]

