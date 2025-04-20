from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from .models import Profile, StudentProfile, TutorProfile, ParentProfile
from rest_framework_simplejwt.tokens import RefreshToken

class UserRegistrationTests(APITestCase):
    def test_register_student_profile(self):
        parent_profile = User.objects.create_user(username="parentuser", password="pass123")
        parent_profile_instance = ParentProfile.objects.create(profile=Profile.objects.create(user=parent_profile, role=Profile.PARENT))

        url = "/users/register/"  # make sure you have this in urls.py
        data = {
            "country": "US",
            "displayName": "studentuser",
            "email": "student@example.com",
            "firstName": "Student",
            "lastName": "User",
            "password": "testpassword",
            "role": 3,
            "parent_profile": parent_profile_instance.id,
            "grade_level": 5,
            "preferred_subjects": [],
            "emergency_contact_name": "Parent User",
            "emergency_contact_phone_number": "5555555555"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="studentuser").exists())
        self.assertTrue(Profile.objects.filter(user__username="studentuser").exists())
        self.assertTrue(StudentProfile.objects.filter(profile__user__username="studentuser").exists())

    def test_register_tutor_profile(self):
        url = "/users/register/"
        data = {
            "country": "US",
            "displayName": "tutoruser",
            "email": "tutor@example.com",
            "firstName": "Tutor",
            "lastName": "User",
            "password": "testpassword",
            "role": 1,
            "city": "New York",
            "state": "NY",
            "bio": "I love teaching.",
            "hourly_rate": "40.00"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="tutoruser").exists())
        self.assertTrue(TutorProfile.objects.filter(profile__user__username="tutoruser").exists())

    def test_register_parent_profile(self):
        url = "/users/register/"
        data = {
            "country": "US",
            "displayName": "parentuser2",
            "email": "parent2@example.com",
            "firstName": "Parent",
            "lastName": "User",
            "password": "testpassword",
            "role": 2,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="parentuser2").exists())
        self.assertTrue(ParentProfile.objects.filter(profile__user__username="parentuser2").exists())


class UserProfileViewTests(APITestCase):
    def setUp(self):
        # Student user
        student_user = User.objects.create_user(username="student", password="password")
        student_profile = Profile.objects.create(user=student_user, role=Profile.STUDENT)
        parent_user = User.objects.create_user(username="parent", password="password")
        parent_profile = Profile.objects.create(user=parent_user, role=Profile.PARENT)
        parent_profile_instance = ParentProfile.objects.create(profile=parent_profile)
        StudentProfile.objects.create(
            profile=student_profile,
            parent_profile=parent_profile_instance,
            grade_level=6,
            emergency_contact_name="Test Parent",
            emergency_contact_phone_number="1112223333"
        )
        self.student_user = student_user
        # api
        self.client = APIClient()
        self.login_url = "/users/login/"
        response = self.client.post(self.login_url, {"username": "student", "password": "password"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.refresh_token = response.json().get("refreshToken")
        self.access_token = response.json().get("accessToken")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

    def test_get_student_profile(self):
        url = "/users/user-profile/"  # replace with your actual path name
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('grade_level', response.data)

    def test_patch_student_profile(self):
        url = "/users/user-profile/"  # replace with your actual path name
        response = self.client.patch(url, {'grade_level': 8}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['grade_level'], 8)

    def test_profile_not_found(self):
        Profile.objects.filter(user=self.student_user).delete()  # force no profile
        url = "/users/user-profile/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

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
    # def test_student_registration(self):
    #     data = {
    #         "country": "USA",
    #         "displayName": "newuser",
    #         "email": "newuser@example.com",
    #         "firstName": "New",
    #         "lastName": "User",
    #         "password": "newpassword",
    #         "role": Profile.STUDENT,  # assuming this will be ignored for now
    #         "parent_profile": None,
    #         "grade_level": "10",
    #         "preferred_subjects": ["Math", "Science"],
    #         "emergency_contact_name": "Jane Doe",
    #         "emergency_contact_phone_number": "1234567890",
    #     }
    #     response = self.client.post(self.register_url, data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(User.objects.count(), 1)
    #     self.assertEqual(Profile.objects.count(), 1)
    #     self.assertEqual(StudentProfile.objects.count(), 1)

    # def test_tutor_registration(self):
    #     data = {
    #         "country": "USA",
    #         "displayName": "newuser",
    #         "email": "newuser@example.com",
    #         "firstName": "New",
    #         "lastName": "User",
    #         "password": "newpassword",
    #         "city": "New York",
    #         "state": "NY",
    #         "bio": "Experienced tutor.",
    #         "hourly_rate": 25,
    #     }
    #     # monkey patch Profile.STUDENT to TUTOR to simulate tutor
    #     original_student = Profile.STUDENT
    #     Profile.STUDENT = Profile.TUTOR
    #     response = self.client.post(self.url, data, format='json')
    #     Profile.STUDENT = original_student  # reset back
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(TutorProfile.objects.count(), 1)

    # def test_parent_registration(self):
    #     Profile.STUDENT = 1
    #     Profile.PARENT = 3
    #     self.base_data["displayName"] = "parentuser"
    #     data = {**self.base_data}
    #     original_student = Profile.STUDENT
    #     Profile.STUDENT = Profile.PARENT
    #     response = self.client.post(self.url, data, format='json')
    #     Profile.STUDENT = original_student
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(ParentProfile.objects.count(), 1)

    # def test_missing_required_fields(self):
    #     data = {
    #         "email": "missing@example.com"
    #         # missing other required fields
    #     }
    #     response = self.client.post(self.url, data)
    #     self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
    
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