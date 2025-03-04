# uploads/views
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, JSONParser
from apps.uploads.models import UploadRecord

# https://blog.nonstopio.com/well-handling-of-cloudinary-with-python-drf-api-28271575e21f
# Create your views here.
class UploadAPIView(APIView):
    parser_classes = (
            MultiPartParser,
            JSONParser,
    )
    # Handles POST HTTP request from frontend
    # Uploading a new file
    def post(self, request):
        file = request.data.get('file')

        # Use the manager method to handle file upload and save
        upload_data = UploadRecord.objects.upload(file)
        UploadRecord.objects.create(upload_data)
        #may or may not make a serializer, depends on if we want to give all the info
        # from upload_data to frontend
        return Response({
                    'status': 'success',
                    'data': upload_data,
                }, status=201)

