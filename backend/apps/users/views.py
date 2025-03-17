from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token
from .models import Profile
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken

login_template = "login.html"
register_profile_template = "register.html"
delete_user_template = "delete_user.html"

def csrf_token_view(request):
  return JsonResponse({"csrfToken": get_token(request)})

# Login View
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refreshToken': str(refresh),
            'accessToken': str(refresh.access_token),
            'username': user.username
        })
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

def logout_view(request):
  logout(request)
  return redirect("login")

@api_view(['POST'])
def register_profile(request):
  username = request.POST["username"]
  password = request.POST["password"]
  first_name = request.POST["first_name"]
  last_name = request.POST["last_name"]
  email = request.POST["email"]
  role = request.POST["role"]  # Get the selected role
  # Create user
  user = User.objects.create_user(
    username=username,
    password=password,
    first_name=first_name,
    last_name=last_name,
    email=email,
  )
  # Create associated Profile
  Profile.objects.create(user=user, role=role)
  return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

def delete_user(request):
  if request.method == "POST":
    username = request.POST["username"]
    try:
      user = User.objects.get(username=username)
      user.delete()
      return HttpResponse(f"User {username} deleted successfully!")
    except User.DoesNotExist:
      return HttpResponse("User not found!")
  return render(request, delete_user_template)