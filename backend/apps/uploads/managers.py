# uploads/managers.py
from django.db import models
from datetime import datetime
import cloudinary.uploader
from cloudinary import CloudinaryImage

class UploadRecordManager(models.Manager):

    def upload(self, file):
        # Upload the file to Cloudinary
        upload_data = cloudinary.uploader.upload(file, use_filename = True, unique_filename = True)
        return upload_data

    def delete_upload(self, cloudinary_public_id):
        # Delete upload from Cloudinary
        result = cloudinary.uploader.destroy(cloudinary_public_id, invalidate = True)
        return result

    def create(self, upload_data, user):
        # Replace 'Z' with '+00:00' for compatibility with fromisoformat
        compatible_created_at = upload_data['created_at'].replace('Z', '+00:00')
        # Convert to datetime object
        created_at_datetime = datetime.fromisoformat(compatible_created_at)

        # Create a new UploadRecord instance with the provided data
        upload_record = self.model(
            type=upload_data["type"],
            resource_type=upload_data["resource_type"],
            file_name=upload_data["original_filename"],
            file_format=upload_data["format"],
            created_at=created_at_datetime,
            cloudinary_public_id=upload_data["public_id"],
            user=user,
            version=upload_data["version"],
            asset_id=upload_data["asset_id"]
        )
        # Save the instance to the database
        upload_record.save()
        return upload_record

    def build_url(self, upload):
        # Build the dynamic URL for the uploaded asset using the public ID and resource type
        cloudinary_public_id = upload.cloudinary_public_id
        resource_type = upload.resource_type
        dynamic_asset_url, _ = cloudinary.utils.cloudinary_url(cloudinary_public_id, resource_type = resource_type)
        return dynamic_asset_url

    def get_upload(self,public_id):
        # Retrieve the upload record by its public ID
        upload_record = self.get_queryset().filter(public_id=public_id).first()
        return upload_record

    def get_uploads_by_id(self, public_ids):
         # Fetch UploadRecords in bulk
        upload_records = self.filter(public_id__in=public_ids)
        return upload_records

    def get_all_uploads(self):
        # Retrieve all upload records from the database
        all_uploads = self.get_queryset().all()
        return all_uploads
