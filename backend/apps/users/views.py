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
        # Extracts the what and where parameters from the request URL
        # (ex: users/search/?what=Jill&where=New%20York%2C%20NY)
        what = self.request.query_params.get('what', "")  # Search term (Tutor name, Subject)
        where = self.request.query_params.get('where', "")  # City, State

        if what == "" or where == "": #what and where should be required input
            search_results = TutorProfile.objects.none()
            return Response({"message": "No results found"}, status=status.HTTP_204_NO_CONTENT)
        else:
            #Parse
            city, state = where.split(",")
            city = city.strip()  # Removes any leading/trailing whitespace
            state = state.strip()

            #will put this query in managers.py****
            # Filter tutor profiles based on city and state
            filtered_profiles = TutorProfile.objects.filter(city=city, state=state)

            # Apply search filtering
            search_results = search.filter(filtered_profiles, what)

            # Optimize query with select_related and only required fields
            search_results = search_results.select_related('profile__user').only(
                'profile__user__first_name',
                'profile__user__last_name',
                'bio',
                'hourly_rate',
                'state',
                'city'
            )

            serializer = TutorProfileSerializer(search_results, many=True)
            return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)

