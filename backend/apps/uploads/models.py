# uploads/models.py
from django.db import models
from apps.uploads.managers import UploadRecordManager, ProfilePictureManager
from apps.users.models import Profile
from cloudinary.models import CloudinaryField
from django.core.exceptions import ValidationError

# https://blog.nonstopio.com/well-handling-of-cloudinary-with-python-drf-api-28271575e21f
class UploadRecord(models.Model):
    # Fields
    id = models.AutoField(primary_key=True)

    # Cloudinary data from upload
    cloudinary_public_id = models.CharField(max_length=255) # Used to build Cloudinary URL
    resource_type = models.CharField(max_length=50) # Used to build Cloudinary URL
    file_name = models.CharField(max_length=100)
    file_format = models.CharField(max_length=50)
    created_at = models.DateTimeField()
    type = models.CharField(max_length=50)
    version = models.PositiveBigIntegerField()
    asset_id = models.CharField(max_length=255)

    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='upload_record')

    # default = 1 for first user (for now)
    description = models.TextField(default="", blank=True, null=False)

    # Link the custom manager to the model
    objects = UploadRecordManager()

    def __str__(self):
        return self.file_name


class ProfilePicture(models.Model):
    upload = models.OneToOneField(UploadRecord, on_delete=models.CASCADE)

    # Link the custom manager to the model
    objects = ProfilePictureManager()

    def save(self, *args, **kwargs):
        # Always validate before saving
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.upload.file_name
