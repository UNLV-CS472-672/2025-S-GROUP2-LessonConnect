# uploads/models.py
import uuid
from django.db import models
from apps.uploads.managers import UploadRecordManager
from cloudinary.models import CloudinaryField
from django.conf import settings

# https://blog.nonstopio.com/well-handling-of-cloudinary-with-python-drf-api-28271575e21f
class UploadRecord(models.Model):
    # Fields
    id = models.AutoField(primary_key=True)  # Internal sequential ID (hidden from URL)
    # Auto generates a unique identifier
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)  # Exposed in URL

    # Cloudinary data from upload
    cloudinary_public_id = models.CharField(max_length=255) # Used to build Cloudinary URL
    resource_type = models.CharField(max_length=50) # Used to build Cloudinary URL
    file_name = models.CharField(max_length=100)
    file_format = models.CharField(max_length=50)
    created_at = models.DateTimeField()
    type = models.CharField(max_length=50)
    version = models.PositiveBigIntegerField()
    asset_id = models.CharField(max_length=255)

    # default = 1 for first user (for now)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='uploads', default = 1)
    description = models.TextField(default="", blank=True, null=False)

    # Link the custom manager to the model
    objects = UploadRecordManager()

    def __str__(self):
        return self.file_name