from django.urls import path
from .views import *

urlpatterns = [
  path('register/', register_user, name='register'),
  path('delete/', delete_user, name='delete_user'),
]