# uploads/views
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, JSONParser
from apps.uploads.models import UploadRecord
from rest_framework.permissions import IsAuthenticated
from apps.uploads.serializers import UploadDetailSerializer, UploadListSerializer
from rest_framework import status

# Debug Only to get test user
from django.conf import settings
from django.apps import apps

# https://blog.nonstopio.com/well-handling-of-cloudinary-with-python-drf-api-28271575e21f
# Create your views here.

class UploadDetailView(APIView):
    permission_classes = [IsAuthenticated]  # Debug only: No authentication required
    # Specifies that the view should only accept JSON-formatted request bodies.
    parser_classes = (
            JSONParser,
    )

    # Handles GET HTTP request from frontend
    # Get a specific upload by id
    def get(self, request, public_id):
        # Use the manager method to find specific upload using public_id (UUID)
        upload = UploadRecord.objects.get_upload(public_id)

        if not upload:  # Check if the object exists
            return Response({'error': 'Upload not found'}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the upload into JSON format
        serializer = UploadDetailSerializer(upload)

        # Return specific upload details to front-end
        return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)
    # Note: Tested this GET request by entering this into the command line
    # curl -X GET http://127.0.0.1:8000/uploads/{public_id}/


    # Handles DELETE HTTP request from frontend
    # Deletes an existing uploaded file from the database

    def delete(self, request, public_id):
        # Use the manager method to find specific upload using public_id (UUID)
        upload = UploadRecord.objects.get_upload(public_id)

        if not upload:  # Check if the object exists
            return Response({'error': 'Upload not found'}, status=status.HTTP_404_NOT_FOUND)

        # Delete from Cloudinary
        result = UploadRecord.objects.delete_upload(upload.cloudinary_public_id)
        if result.get("result") != "ok":
            return Response({'error': 'Delete unsuccessful'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Delete from database
        upload.delete()
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    # Note: Tested this DELETE request by entering this into the command line
    # curl -X DELETE http://127.0.0.1:8000/uploads/{public_id}/


    # Handles PATCH request from the frontend
    # Updates the description of a file
    def patch(self, request, public_id):
        new_description = request.data.get('description')  # Get 'description' from request body

        # Use the manager method to find specific upload using public_id (UUID)
        upload = UploadRecord.objects.get_upload(public_id)

        if not upload:  # Check if the object exists
            return Response({'error': 'Upload not found'}, status=status.HTTP_404_NOT_FOUND)

        # Partially update the upload record with the new description
        serializer = UploadDetailSerializer(upload, data={'description': new_description}, partial=True)
        if serializer.is_valid():
            # Save the updated upload record if validation passes
            serializer.save()
            # Return updated specific upload details to front-end
            return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response(status=HTTP_400_BAD_REQUEST)
    # Note: Tested this PATCH request by entering this into the command line
    # curl -X PATCH http://127.0.0.1:8000/uploads/{public_id}/ -H "Content-Type: application/json" -d '{"description": "Updated upload description"}'



class UploadListView(APIView):
    permission_classes = []  # Debug only: No authentication required
    # Specifies that the view can accept both multipart form data
    # and JSON-formatted request bodies.
    parser_classes = (
            MultiPartParser,
            JSONParser,
    )

    # Handles POST HTTP request from frontend
    # Uploading a new file
    def post(self, request):
        # request to get user
        # user = request.user # once authentication is a thing

        # Get the user model class (Debug only)
        User = apps.get_model(settings.AUTH_USER_MODEL)

        # Get the first user in the database (Debug only)
        user = User.objects.first()

        # Check if user exists
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # request to get file to be uploaded
        file = request.data.get('file')

        # Check if file is provided in the request
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Use the manager method to handle file upload
        upload_data = UploadRecord.objects.upload(file)

        # Use the manager method to save relevant metadata into database
        UploadRecord.objects.create(upload_data, user)

        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    # Note: Tested this POST request by entering this into the command line
    # curl -X POST http://127.0.0.1:8000/uploads/ -F "file=@path_to_file"


    # Handles GET HTTP request from frontend
    # Get all uploads
    def get(self, request):
        # Use the manager method to fetch all uploads
        all_uploads = UploadRecord.objects.get_all_uploads()

        if not all_uploads.exists():  # Check if the queryset is empty
            return Response({'error': 'No uploads found'}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the uploads
        serializer = UploadListSerializer(all_uploads, many=True)

        # Return upload information of each upload to front-end
        return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)

        # Note: Tested this GET request by entering this into the command line
        # curl -X GET http://127.0.0.1:8000/uploads/


