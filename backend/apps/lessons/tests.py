from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from apps.lessons.models import Assignment

# Create your tests here.
class AssignmentAPITests(APITestCase):
    def setUp(self):
        # Create a superuser for testing
        self.user = User.objects.create_superuser(
            username='testadmin', password='testpassword', email='test@test.com'
        )

        # Get access token
        response = self.client.post(
            reverse('token_obtain_pair'),  # Use the actual name of the URL if configured
            {'username': 'testadmin', 'password': 'testpassword'},
        )
        self.access_token = response.data['access']

        # Set authorization header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        # Create an initial assignment for testing
        self.assignment = Assignment.objects.create(
            title="Initial Assignment",
            description="Initial assignment description.",
            assignment_type="HW",
            deadline="2025-12-01T12:00:00Z",
        )

        # Define URLs
        self.detail_url = reverse('assignment-detail', kwargs={'pk': self.assignment.pk})
        self.create_url = reverse('assignment-create')

        # hardcode?
        # self.list_url = '/lessons/assignments/'
        #self.detail_url = f'/lessons/assignments/{self.assignment.pk}/'
        #self.create_url = '/lessons/assignments/create/'

    # Test GET single assignment
    def test_get_assignment(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['title'], 'Initial Assignment')

    # Test POST create new assignment
    def test_create_assignment(self):
        data = {
            "title": "New Assignment",
            "description": "This is a new assignment.",
            "assignment_type": "HW",
            "deadline": "2025-12-01T12:00:00Z"
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['data']['title'], 'New Assignment')

    # Test PATCH update assignment
    def test_update_assignment(self):
        data = {"title": "Updated Title"}
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['title'], 'Updated Title')

    # Test DELETE assignment
    def test_delete_assignment(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')

        # Verify it is deleted
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
