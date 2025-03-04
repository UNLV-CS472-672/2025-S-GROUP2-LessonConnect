# uploads/models.py
import uuid
from django.db import models
from apps.uploads.managers import UploadRecordManager
from cloudinary.models import CloudinaryField
from apps.users.models import Profile

# https://blog.nonstopio.com/well-handling-of-cloudinary-with-python-drf-api-28271575e21f
class UploadRecord(models.Model):
    #Fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file_name = models.CharField(max_length=100)
    FILE_TYPE_CHOICES = (
        ('pdf','PDF'),
        ('jpg', 'JPG'),
        ('png','PNG'),
    )
    upload_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(null=True, blank=True)
    media_url = models.URLField(max_length=1000, null=False, blank=False)
    upload = CloudinaryField(resource_type='auto') # grants access to Cloudinary functionalities
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE) # many to one relationship

    # Link the custom manager to the model
    objects = UploadRecordManager()