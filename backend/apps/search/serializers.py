from rest_framework import serializers
from apps.users.models import TutorProfile

class TutorSearchResultSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="profile.user.first_name")
    last_name = serializers.CharField(source="profile.user.last_name")
    class Meta:
        model = TutorProfile
        fields = ["first_name", "last_name", "bio", "hourly_rate", "state", "city"]