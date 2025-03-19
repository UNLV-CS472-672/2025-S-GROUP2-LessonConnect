from django.urls import path
from .views import *

  path("login/", login_view, name="login"),
  path("logout/", logout_view, name="logout"),
  path("csrf/", csrf_token_view, name="csrf"),
]
