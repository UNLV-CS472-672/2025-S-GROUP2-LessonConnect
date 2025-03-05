# uploads/managers.py
from django.db import models
from datetime import datetime
import cloudinary.uploader

class UploadRecordManager(models.Manager):
    def upload(self, file):
        # Upload the file to Cloudinary
        upload_data = cloudinary.uploader.upload(file)
        return upload_data

    def create(self, upload_data, profile):
        # Replace 'Z' with '+00:00' for compatibility with fromisoformat
        compatible_created_at = upload_data['created_at'].replace('Z', '+00:00')
        # Convert to datetime object
        created_at_datetime = datetime.fromisoformat(compatible_created_at)

        # Create a new UploadRecord instance with the provided data
        upload_record = self.model(
            media_url=upload_data["secure_url"],
            file_name=upload_data["original_filename"],
            file_format=upload_data["format"],
            created_at=created_at_datetime,
            public_id=upload_data["public_id"],
            profile=profile
        )
        # Save the instance to the database
        upload_record.save()
