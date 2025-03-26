from rest_framework import serializers
from apps.users.models import TutorProfile

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
        # Ensure that the profile and profile_picture exist before accessing them
        if hasattr(result_data, "profile") and hasattr(result_data.profile, "upload_record"):
            return UploadRecord.objects.build_url(result_data.profile.upload_record)
        return None  # Return None if there's no profile picture
