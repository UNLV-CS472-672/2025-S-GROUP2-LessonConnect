# uploads/views
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, JSONParser
from apps.uploads.models import UploadRecord
from apps.users.models import Profile
# Debugging
#from rest_framework.permissions import AllowAny # debugging only: bypass authentication

#logging
import logging
logger = logging.getLogger(__name__)

# https://blog.nonstopio.com/well-handling-of-cloudinary-with-python-drf-api-28271575e21f
# Create your views here.
class UploadAPIView(APIView):
    #permission_classes = [AllowAny]  # debugging only: bypass authentication
    parser_classes = (
            MultiPartParser,
            JSONParser,
    )
    # Handles POST HTTP request from frontend
    # Uploading a new file
    def post(self, request):
        file = request.data.get('file')
        profile = Profile.objects.get(user=request.user)

        try:
            # Use the manager method to handle file upload and save
            upload_data = UploadRecord.objects.upload(file)
            # Debug: Print the upload_data to see its contents in the console
            # print(upload_data)
            UploadRecord.objects.create(upload_data, profile)
        except Exception as e:
            logger.error(f"Error uploading file: {e}")
            raise  # This will raise the exception and also log it

        #may or may not make a serializer, depends on if we want to give all the info
        # from upload_data to frontend
        return Response({
                    'status': 'success',
                    'data': upload_data,
                }, status=201)

