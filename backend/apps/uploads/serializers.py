# uploads/serializers.py
from rest_framework import serializers
from apps.uploads.models import UploadRecord

class UploadDetailSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = UploadRecord
        fields = ['file_url', 'description']

    def get_file_url(self, upload):
        return UploadRecord.objects.build_url(upload)

class UploadListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadRecord
        fields = ['file_name', 'file_format', 'public_id']
