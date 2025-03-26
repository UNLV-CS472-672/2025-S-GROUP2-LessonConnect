from django.urls import path
from .views import *
urlpatterns = [
  path("login/", login_view, name="login"),
  path("logout/", logout_view, name="logout"),
  path("register/", register_profile, name="register"),
  path("delete_user/", delete_user, name="delete"),
  path("csrf/", csrf_token_view, name="csrf"),
]
