from rest_framework import serializers
from apps.users.models import TutorProfile
from apps.uploads.models import UploadRecord

class TutorSearchResultSerializer(serializers.ModelSerializer):
    # Define custom fields to fetch first and last names from the related user profile
    first_name = serializers.CharField(source="profile.user.first_name")
    last_name = serializers.CharField(source="profile.user.last_name")
    image_url = serializers.SerializerMethodField()  # Custom field to get the file URL
    # Specify the model and fields to be included in the serialized output
    class Meta:
        model = TutorProfile
        fields = ["first_name", "last_name", "bio", "hourly_rate", "state", "city", "rating", "image_url"]

    def get_image_url(self, result_data):
        # Use the manager method to find specific upload using public_id (UUID)
        upload = UploadRecord.objects.get_upload(result_data.image_id)
        # Method to build and return the file URL
        return UploadRecord.objects.build_url(upload)