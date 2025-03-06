# uploads/models.py
import uuid
from django.db import models
from apps.uploads.managers import UploadRecordManager
from cloudinary.models import CloudinaryField
from apps.users.models import Profile

# https://blog.nonstopio.com/well-handling-of-cloudinary-with-python-drf-api-28271575e21f
class UploadRecord(models.Model):
    #Fields

    # Auto generates a unique identifier
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Cloudinary data from upload
    public_id = models.CharField(max_length=255, unique=True)
    file_name = models.CharField(max_length=100)
    file_format = models.CharField(max_length=50)
    created_at = models.DateTimeField()
    resource_type = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    version = models.PositiveBigIntegerField()

    profile = models.ForeignKey(Profile, on_delete=models.CASCADE) # many to one relationship
    description = models.TextField(null=True, blank=True)

    # Link the custom manager to the model
    objects = UploadRecordManager()

    def __str__(self):
        return self.file_name