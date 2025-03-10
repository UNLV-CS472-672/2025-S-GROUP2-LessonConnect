# uploads/serializers.py
from rest_framework import serializers
from apps.uploads.models import UploadRecord

class UploadDetailSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()  # Custom field to get the file URL
    description = serializers.CharField(allow_blank=True, required=False)  # Allow empty descriptions

    class Meta:
        model = UploadRecord
        fields = ['file_url', 'description']

    def get_file_url(self, upload):
        # Method to build and return the file URL
        return UploadRecord.objects.build_url(upload)

class UploadListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadRecord
        fields = ['file_name', 'file_format', 'public_id']
