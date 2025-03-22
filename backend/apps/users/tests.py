from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Profile
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
        self.delete_user_url = "/users/delete/"
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
    
    def test_register_profile(self):
        """Test user registration."""
        response = self.client.post(self.register_url, {
            "country": "USA",
            "displayName": "newuser",
            "email": "newuser@example.com",
            "firstName": "New",
            "lastName": "User",
            "password": "newpassword",
            "role": Profile.STUDENT
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())
        self.assertTrue(Profile.objects.filter(user__username="newuser").exists())
    
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