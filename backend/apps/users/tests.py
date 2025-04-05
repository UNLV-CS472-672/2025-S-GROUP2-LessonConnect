from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Profile, StudentProfile, TutorProfile, ParentProfile
from rest_framework_simplejwt.tokens import RefreshToken

class UserAPITestCase(TestCase):
    def setUp(self):
        """Set up test data and API client."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            password="testpassword",
            first_name="Test",
            last_name="User",
            email="test@example.com"
        )
        self.profile = Profile.objects.create(user=self.user, role=Profile.STUDENT)
        self.login_url = "/users/login/"
        self.register_url = "/users/register/"
        self.csrf_token_url = "/users/csrf/"
        self.delete_user_url = "/users/delete_user/"
        self.logout_url = "/users/logout/"
        
        # Obtain JWT tokens
        response = self.client.post(self.login_url, {"username": "testuser", "password": "testpassword"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.refresh_token = response.json().get("refreshToken")
        self.access_token = response.json().get("accessToken")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

    def test_csrf_token_view(self):
        """Test CSRF token endpoint."""
        response = self.client.get(self.csrf_token_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("csrfToken", response.json())
    
    def test_login_view_success(self):
        """Test successful login."""
        response = self.client.post(self.login_url, {
            "username": "testuser",
            "password": "testpassword"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("accessToken", response.json())
    
    def test_login_view_failure(self):
        """Test failed login with incorrect credentials."""
        response = self.client.post(self.login_url, {
            "username": "wronguser",
            "password": "wrongpassword"
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("error", response.json())
    
    # https://chatgpt.com/share/67f1b749-b728-8005-be5f-debe1a8a40c5
    # had to be tweaked a bit...
    def test_student_registration(self):
        data = {
            "country": "USA",
            "displayName": "newuser",
            "email": "newuser@example.com",
            "firstName": "New",
            "lastName": "User",
            "password": "newpassword",
            "role": Profile.STUDENT,  # assuming this will be ignored for now
            "parent_profile": None,
            "grade_level": "10",
            "preferred_subjects": ["Math", "Science"],
            "emergency_contact_name": "Jane Doe",
            "emergency_contact_phone_number": "1234567890",
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(Profile.objects.count(), 1)
        self.assertEqual(StudentProfile.objects.count(), 1)

    def test_tutor_registration(self):
        data = {
            "country": "USA",
            "displayName": "newuser",
            "email": "newuser@example.com",
            "firstName": "New",
            "lastName": "User",
            "password": "newpassword",
            "city": "New York",
            "state": "NY",
            "bio": "Experienced tutor.",
            "hourly_rate": 25,
        }
        # monkey patch Profile.STUDENT to TUTOR to simulate tutor
        original_student = Profile.STUDENT
        Profile.STUDENT = Profile.TUTOR
        response = self.client.post(self.url, data, format='json')
        Profile.STUDENT = original_student  # reset back
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TutorProfile.objects.count(), 1)

    def test_parent_registration(self):
        Profile.STUDENT = 1
        Profile.PARENT = 3
        self.base_data["displayName"] = "parentuser"
        data = {**self.base_data}
        original_student = Profile.STUDENT
        Profile.STUDENT = Profile.PARENT
        response = self.client.post(self.url, data, format='json')
        Profile.STUDENT = original_student
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ParentProfile.objects.count(), 1)

    def test_missing_required_fields(self):
        data = {
            "email": "missing@example.com"
            # missing other required fields
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def test_delete_user_success(self):
        """Test deleting an existing user."""
        response = self.client.post(self.delete_user_url, {"username": "testuser"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(User.objects.filter(username="testuser").exists())
    
    def test_delete_user_not_found(self):
        """Test deleting a non-existent user."""
        response = self.client.post(self.delete_user_url, {"username": "nonexistent"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("User not found!", response.content.decode())
    
    def test_logout_view(self):
        """Test logout functionality."""
        response = self.client.post(self.logout_url, {"refresh_token": self.refresh_token})
        if(response.status_code==status.HTTP_400_BAD_REQUEST):
            print(response.data["error"])
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.json())
    
    # as per Allison's recommendation
    def tearDown(self):
      self.user.delete()