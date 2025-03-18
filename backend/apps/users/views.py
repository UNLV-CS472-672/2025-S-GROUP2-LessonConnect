from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponse

register_profile_template = "register.html"
delete_user_template = "delete_user.html"

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

