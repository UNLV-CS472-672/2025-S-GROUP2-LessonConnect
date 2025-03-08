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

    def create(self, upload_data, profile):
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
            profile=profile,
            version=upload_data["version"]

        )
        # Save the instance to the database
        upload_record.save()

    #Probably GET and DELETE will use this URL
    def buildUrl(self, id):
        upload_record = self.get_queryset().filter(id=id).values('cloudinary_public_id', 'resource_type').first()

        cloudinary_public_id = upload_record['cloudinary_public_id']
        resource_type = upload_record['resource_type']

        dynamic_asset_url, _ = cloudinary.utils.cloudinary_url(cloudinary_public_id, resource_type = resource_type)
        return dynamic_asset_url

    def getUpload(self,public_id):
        upload_record = self.get_queryset().filter(public_id=public_id).first()
        return upload_record
