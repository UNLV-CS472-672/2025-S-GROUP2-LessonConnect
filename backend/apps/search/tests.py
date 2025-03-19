from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.users.models import Profile, TutorProfile
from .models import Subject, Category

# Create your tests here.
class SearchViewTestCase(APITestCase):
    def setUp(self):
        # Create a test user
        self.test_user = get_user_model().objects.create_user(
                            username='testuser',
                            password='password',
                            first_name='Bucky',
                            last_name='Whet',
                            email='testuser@example.com'
                        )
        # Create a test profile
        self.test_profile = Profile.objects.create(user=self.test_user, role=1)
        # Create a test category
        self.category_math = Category.objects.create(title="Mathematics")
        # Create test subjects
        self.subject_geometry= Subject.objects.create(title="Geometry", category = self.category_math)

        # Create test tutor profiles
        self.tutor = TutorProfile.objects.create_tutor_profile(profile=self.test_profile, city="New York", state="NY", hourly_rate=25.0)

        # Link tutors to subjects
        self.tutor.subjects.add(self.subject_geometry)

        # Define the search endpoint URL
        self.url = reverse("search")

    def test_missing_parameters(self):
        # Make the API call with a missing 'what'
        response = self.client.get(self.url, {"what": "Math"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Make the API call with a missing 'where'
        response = self.client.get(self.url, {"where": "New York, NY"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_location_parsing_failure(self):
        # Make the API call with a problematic 'where' parameter
        response = self.client.get(self.url, {"what": "Math", "where": "Bad Location"})
        # Check for error response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Error parsing location", response.data["message"])

    def test_valid_search(self):
        response = self.client.get(self.url, {"what": "Math", "where": "New York, NY"})

        # Check response status and content
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]), 1)
        self.assertEqual(response.data["data"][0]["first_name"], "Bucky")
        self.assertEqual(response.data["data"][0]["last_name"], "Whet")
