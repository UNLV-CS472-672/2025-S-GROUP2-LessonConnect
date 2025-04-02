from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import UploadRecord
from apps.users.models import Profile
from django.contrib.auth import get_user_model
from .serializers import UploadListSerializer

class UploadRecordViewTest(APITestCase):
    def setUp(self):
        self.type = "test-type"
        self.resource_type = "test-resource-type"
        self.original_filename = "test-file-name"
        self.file_format = "test-file-format"
        self.created_at = "1960-01-01T12:00:00Z"
        self.cloudinary_public_id = "test-cloudinary-public-id"
        self.version = 1234567890
        self.asset_id = "test-asset-id"

        self.url = reverse('upload-list')

        self.fake_user = get_user_model().objects.create_user(
                    username='testuser',
                    password='password',
                    first_name='Test',
                    last_name='User',
                    email='testuser@example.com'
                )
        self.profile = Profile.objects.create(self.fake_user, 2)

    # Ensure that if there are no uploads,
    # the API returns a 404 error with the proper message.
    def test_get_uploads_empty(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'error': 'No uploads found'})

    # Test that the API returns a 200 status and
    # the correct serialized data when uploads exist.
    def test_get_uploads_success(self):
        # Create an example UploadRecord instance.
        upload_record = UploadRecord.objects.create(
            upload_data={
                "type": self.type,
                "resource_type": self.resource_type,
                "original_filename": self.original_filename,
                "format": self.file_format,
                "created_at": self.created_at,
                "public_id": self.cloudinary_public_id,
                "version": self.version,
                "asset_id": self.asset_id,
            },
            profile=self.profile
        )

        # Perform the GET request
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Serialize the created object using the serializer
        expected_response = {'status': 'success', 'data': UploadListSerializer([upload_record], many=True).data}

        # Assert that the response data matches the expected serialized data
        self.assertEqual(response.data, expected_response)
