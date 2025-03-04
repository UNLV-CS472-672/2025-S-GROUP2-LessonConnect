# uploads/managers.py
from django.db import models
import cloudinary.uploader

class UploadRecordManager(models.Manager):
    def upload(file):
        # Upload the file to Cloudinary
        upload_data = cloudinary.uploader.upload(file)
        return upload_data

    def create(self, upload_data):
        # Create and save a new UploadRecord instance with the secure URL
        # WIP
        self.create(
            media_url = upload_data["secure_url"],
            file_name = upload_data["original_filename"] #not sure
        )
