from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token
from .models import Profile

login_template = "login.html"
register_profile_template = "register.html"
delete_user_template = "delete_user.html"

def csrf_token_view(request):
  return JsonResponse({"csrfToken": get_token(request)})

def login_view(request):
  user = request.user if request.user.is_authenticated else None
  error = None

  if request.method == "POST":
    username = request.POST.get("username")
    password = request.POST.get("password")
    
    user = authenticate(request, username=username, password=password)
    if user:
      login(request, user)
    else:
      return render(request, "login.html", {"error": "Invalid username or password"})

  return render(request, "login.html", {"user": user, "error": error})

def logout_view(request):
  logout(request)
  return redirect("login")

def register_profile(request):
  if request.method == "POST":
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
    return HttpResponse(f"User {user.username} created successfully with role {role}!")

  return render(request, register_profile_template)

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