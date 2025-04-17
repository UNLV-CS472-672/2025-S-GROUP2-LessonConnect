# https://chatgpt.com/share/67df13f7-a784-8005-8349-637a36bf1765

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token
from .models import Profile
from apps.users.models import Profile, TutorProfile, ParentProfile, StudentProfile
from apps.uploads.models import UploadRecord, ProfilePicture
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.decorators import api_view, permission_classes
from .serializers import (
    StudentProfileSerializer,
    TutorProfileSerializer,
    ParentProfileSerializer,
)

login_template = "login.html"
register_profile_template = "register.html"
delete_user_template = "delete_user.html"

@api_view(['GET'])
def csrf_token_view(request):
  return JsonResponse({"csrfToken": get_token(request)})

# Login View
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data['username']
    password = request.data['password']
    user = authenticate(username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refreshToken': str(refresh),
            'accessToken': str(refresh.access_token),
            'username': user.username
        }, status=status.HTTP_200_OK)
        # https://stackoverflow.com/questions/7064374/proper-http-headers-for-login-success-fail-responses
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# Logout View
@api_view(['POST'])
def logout_view(request):
    try:
        refresh_token = request.data["refresh_token"]
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_profile(request):
  country = request.data["country"]
  username = request.data["displayName"]
  email = request.data["email"]
  first_name = request.data["firstName"]
  last_name = request.data["lastName"]
  password = request.data["password"]
  # TODO: replace "1" with "role" once that is handled by the frontend
  # role = request.data["role"]  # Get the selected role
  role = Profile.STUDENT
  # Create user
  user = User.objects.create_user(
    username=username,
    password=password,
    first_name=first_name,
    last_name=last_name,
    email=email,
  )
  # Create associated Profile
  profile = Profile.objects.create(user, role)
  

  image=request.data.get("image") #For now, get an optional image

  # Store optional profile picture
  if image:
    # Use the manager method to create and save profile picture
    profile_picture = ProfilePicture.objects.create(profile)
    # Use the manager method to handle file upload
    upload_data = UploadRecord.objects.upload(image)
    # Use manager method to create and save metadata
    upload_record = UploadRecord.objects.create(upload_data)
    UploadRecord.objects.add_profile_picture(upload_record, profile_picture)

  # Create Tutor Profile if role is Tutor
  if int(profile.role) == Profile.TUTOR:
      city=request.data["city"]
      state=request.data["state"]
      bio=request.data["bio"]
      hourly_rate=request.data["hourly_rate"]
      tutor = TutorProfile.objects.create(profile=profile, city=city, state=state, bio=bio, hourly_rate=hourly_rate)
  # otherwise, check if parent
  elif int(profile.role) == Profile.PARENT:
      parent = ParentProfile.objects.create(profile=profile)
  # otherwise, student
  else:
      parent_profile = request.data["parent_profile"]
      grade_level = request.data["grade_level"]
      preferred_subjects = request.data["preferred_subjects"]
      emergency_contact_name = request.data["emergency_contact_name"]
      emergency_contact_phone_number = request.data["emergency_contact_phone_number"]
      parent_profile_id = request.data["parent_profile"]
      parent_profile_instance = ParentProfile.objects.get(id=parent_profile_id)
      student = StudentProfile.objects.create(
          profile=profile,
          parent_profile=parent_profile_instance,
          grade_level = grade_level,
          preferred_subjects = preferred_subjects,
          emergency_contact_name = emergency_contact_name,
          emergency_contact_phone_number = emergency_contact_phone_number
      )
  return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def delete_user(request):
  if request.method == "POST":
    username = request.data["username"]
    try:
      user = User.objects.get(username=username)
      user.delete()
      return Response(f"User {username} deleted successfully!", status=status.HTTP_200_OK)
    except User.DoesNotExist:
      # https://stackoverflow.com/questions/17884469/what-is-the-http-response-code-for-failed-http-delete-operation
      return Response("User not found!", status=status.HTTP_404_NOT_FOUND)
  # should never reach here, but still just in case
  return Response("FATAL: Undefined functionality, please contact system administrator", 
                  status=status.HTTP_404_NOT_FOUND)

# https://chatgpt.com/share/67f1b472-b004-8005-8550-62871c22bef9
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)

            if profile.role == Profile.STUDENT:
                student_profile = StudentProfile.objects.get(profile=profile)
                serializer = StudentProfileSerializer(student_profile)
            elif profile.role == Profile.TUTOR:
                tutor_profile = TutorProfile.objects.get(profile=profile)
                serializer = TutorProfileSerializer(tutor_profile)
            elif profile.role == Profile.PARENT:
                parent_profile = ParentProfile.objects.get(profile=profile)
                serializer = ParentProfileSerializer(parent_profile)
            else:
                return Response({'error': 'Invalid role.'}, status=400)

            return Response(serializer.data)

        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=404)

    def patch(self, request):
        try:
            profile = Profile.objects.get(user=request.user)

            if profile.role == Profile.STUDENT:
                student_profile = StudentProfile.objects.get(profile=profile)
                serializer = StudentProfileSerializer(student_profile, data=request.data, partial=True)
            elif profile.role == Profile.TUTOR:
                tutor_profile = TutorProfile.objects.get(profile=profile)
                serializer = TutorProfileSerializer(tutor_profile, data=request.data, partial=True)
            elif profile.role == Profile.PARENT:
                parent_profile = ParentProfile.objects.get(profile=profile)
                serializer = ParentProfileSerializer(parent_profile, data=request.data, partial=True)
            else:
                return Response({'error': 'Invalid role.'}, status=400)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=404)