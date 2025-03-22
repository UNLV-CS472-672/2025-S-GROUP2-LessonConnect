from django.urls import path
from .views import *

urlpatterns = [
  path('register/', register_profile, name='register'),
  path('delete/', delete_user, name='delete_user'),
  path("login/", login_view, name="login"),
  path("logout/", logout_view, name="logout"),
  path("csrf/", csrf_token_view, name="csrf"),
]