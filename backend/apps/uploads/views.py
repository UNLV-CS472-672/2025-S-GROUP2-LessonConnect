# uploads/views
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, JSONParser
from apps.uploads.models import UploadRecord
from apps.users.models import Profile
from rest_framework.permissions import IsAuthenticated
from apps.uploads.serializers import UploadDetailSerializer, UploadListSerializer

# https://blog.nonstopio.com/well-handling-of-cloudinary-with-python-drf-api-28271575e21f
# Create your views here.
class UploadDetailView(APIView):
    permission_classes = []  # Debug only: No authentication required
    parser_classes = (
            JSONParser,
    )
    # Handles GET HTTP request from frontend
    # Get a specific upload by id
    # Note: Tested this GET request by entering this into the command line
    # curl -X GET http://127.0.0.1:8000/uploads/{public_id}/
    def get(self, request, public_id):
        # Use the manager method to find specific upload using public_id (UUID)
        upload = UploadRecord.objects.get_upload(public_id)

        # Serialize the upload into JSON format
        serializer = UploadDetailSerializer(upload)

        return Response(serializer.data)
    # Handles DELETE HTTP request from frontend
    # Deletes an existing uploaded file from the database
    # Note: Tested this DELETE request by entering this into the command line
    # curl -X DELETE http://127.0.0.1:8000/uploads/{public_id}/
    def delete(self, request, public_id):
        # Use the manager method to find specific upload using public_id (UUID)
        upload = UploadRecord.objects.get_upload(public_id)

        UploadRecord.objects.delete_upload(upload.cloudinary_public_id)

        upload.delete()

        return Response({
                    'status': 'success',
                }, status=201)
    # Note: Tested this PATCH request by entering this into the command line
    # curl -X PATCH http://127.0.0.1:8000/uploads/{public_id}/
    # -H "Content-Type: application/json" -d '{"description": "Updated upload description"}
    def patch(self, request, public_id):
        new_description = request.data.get('description')  # Get 'description' from request body

        # Use the manager method to find specific upload using public_id (UUID)
        upload = UploadRecord.objects.get_upload(public_id)

        serializer = UploadDetailSerializer(upload, data={'description': new_description}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=201)
        else:
            return Response(status=HTTP_400_BAD_REQUEST)

class UploadListView(APIView):
    permission_classes = []  # Debug only: No authentication required
    parser_classes = (
            MultiPartParser,
            JSONParser,
    )

    # Handles POST HTTP request from frontend
    # Uploading a new file
    # Note: Tested this POST request by entering this into the command line
    # curl -X POST http://127.0.0.1:8000/uploads/ -F "file=@path_to_file"
    def post(self, request):
        # request to get file to be uploaded (the way of getting file may have to be changed later)
        file = request.data.get('file')

        #profile = Profile.objects.get(user=request.user) # once authentication is a thing
        profile = Profile.objects.first()  # Debug Only: Assign a test user

        # Use the manager method to handle file upload
        upload_data = UploadRecord.objects.upload(file)

        # Use the manager method to save relevant metadata into database
        UploadRecord.objects.create(upload_data, profile)

        #may or may not make a serializer, depends on if we want to give all the info
        # from upload_data to frontend
        return Response({
                    'status': 'success',
                }, status=201)
        # Whenever create() fails, the image should be deleted from
        # cloudinary cause otherwise it takes space

    # Handles GET HTTP request from frontend
    # Get all uploads
    # Note: Tested this POST request by entering this into the command line
    # curl -X GET http://127.0.0.1:8000/uploads/
    def get(self, request):
        # Use the manager method to find all uploads
        all_uploads = UploadRecord.objects.get_all_uploads()
        # Serialize the upload into JSON format
        serializer = UploadListSerializer(all_uploads, many=True)

        return Response(serializer.data)
