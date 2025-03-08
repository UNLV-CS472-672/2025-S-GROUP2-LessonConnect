# uploads/views
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, JSONParser
from apps.uploads.models import UploadRecord
from apps.users.models import Profile
from rest_framework.permissions import IsAuthenticated
from apps.uploads.serializers import UploadDetailSerializer

# https://blog.nonstopio.com/well-handling-of-cloudinary-with-python-drf-api-28271575e21f
# Create your views here.
# Need to test + fix the model migration****
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
        upload = UploadRecord.objects.getUpload(public_id)

        # Serialize the upload into JSON format
        serializer = UploadDetailSerializer(upload)

        return Response(serializer.data)

class UploadListView(APIView):
    permission_classes = []  # Debug only: No authentication required
    parser_classes = (
            MultiPartParser,
            JSONParser,
    )

    # Handles POST HTTP request from frontend
    # Uploading a new file
    # Note: Tested this POST request by entering this into the command line
    # curl -X POST http://127.0.0.1:8000/uploads/upload/ -F "file=@path_to_file"
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

    # Handles DELETE HTTP request from frontend
    # Deletes an existing uploaded file from the database

    # Handles GET HTTP request from frontend
    #  Get all uploads

