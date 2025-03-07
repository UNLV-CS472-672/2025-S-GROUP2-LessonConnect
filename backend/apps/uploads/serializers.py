# uploads/serializers.py
from rest_framework import serializers
from apps.users.models import UploadRecord

class UploadDetailSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = UploadRecord
        fields = ['file_url', 'file_name', 'description', 'file_format', 'public_id']

    def get_file_url(self, upload):
        return upload.buildUrl(upload.id)
