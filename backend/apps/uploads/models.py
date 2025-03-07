# uploads/models.py
import uuid
from django.db import models
from apps.uploads.managers import UploadRecordManager
from cloudinary.models import CloudinaryField
from apps.users.models import Profile

# https://blog.nonstopio.com/well-handling-of-cloudinary-with-python-drf-api-28271575e21f
class UploadRecord(models.Model):
    # Fields
    id = models.AutoField(primary_key=True)  # Internal sequential ID (hidden from URL)
    # Auto generates a unique identifier
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)  # Exposed in URL

    # Cloudinary data from upload
    cloudinary_public_id = models.CharField(max_length=255, unique=True) # Used to build Cloudinary URL
    resource_type = models.CharField(max_length=50) # Used to build Cloudinary URL
    file_name = models.CharField(max_length=100)
    file_format = models.CharField(max_length=50)
    created_at = models.DateTimeField()
    type = models.CharField(max_length=50)
    version = models.PositiveBigIntegerField()

    profile = models.ForeignKey(Profile, on_delete=models.CASCADE) # many to one relationship
    description = models.TextField(null=True, blank=True)

    # Link the custom manager to the model
    objects = UploadRecordManager()

    def __str__(self):
        return self.file_name