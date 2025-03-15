from django.urls import path
from .views import *

urlpatterns = [
  path('register/', register_profile, name='register'),
  path('delete/', delete_user, name='delete_user'),
  path('search/', SearchView.as_view(), name='search'),
]
