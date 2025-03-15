from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Profile, TutorProfile
from .serializers import TutorProfileSerializer
from watson import search
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

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

class SearchView(APIView):
    permission_classes = []  # Debug only: No authentication required
    def get(self, request, format=None):
        #Extracts the q parameter from the request URL (ex: users/search/?q=python)
        q = self.request.query_params.get('q', "")
        if q == "":
            search_results = TutorProfile.objects.none()
        else:
            search_results = search.filter(TutorProfile, q)
            print(search_results)
        #serializer = TutorProfileSerializer(search_results, many=True)
        #return Response(serializer.data)
        return Response(status=status.HTTP_200_OK)