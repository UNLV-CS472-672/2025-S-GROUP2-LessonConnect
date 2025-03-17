from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Profile, TutorProfile, Subject, Category
from .serializers import TutorProfileSerializer
from django.db.models import Q
import re

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
        what = self.request.query_params.get('what', "")  # Search term (Tutor name, Subject, Category)
        where = self.request.query_params.get('where', "")  # City, State (Assumes user insert both)

        if what == "" or where == "": #what and where should be required input
            search_results = TutorProfile.objects.none()
            return Response({"message": "No results found"}, status=status.HTTP_204_NO_CONTENT)

        #Parse the where query
        city, state = TutorProfile.objects.parse_where_query(where)
        filtered_tutors = TutorProfile.objects.filter_tutors_by_location(what, city, state)
        search_results = TutorProfile.objects.search(filtered_tutors, what)

        # Done to help match partial words that django-watson might overlook
        # When searching for subject/category
        search_terms = re.split(r'[\W\s]+', what)
        query = Q()

        for term in search_terms:
            query = Q(category__title__icontains=term) | Q(title__icontains=term)

        subject_query = Subject.objects.filter(query)

        if subject_query:
            filtered_tutors = TutorProfile.objects.filter_tutors_by_subject(filtered_tutors, subject_query)
            search_results = (filtered_tutors | search_results).distinct()

        result_data = TutorProfile.objects.get_result_data(search_results)
        serializer = TutorProfileSerializer(result_data, many=True)

        return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)