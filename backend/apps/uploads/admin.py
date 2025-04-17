# uploads/admin.py
from django.contrib import admin
from apps.uploads.models import UploadRecord, ProfilePicture
# Debug Only: Shows public_id and id in localhost/admin


class UploadRecordAdmin(admin.ModelAdmin):
    list_display=['cloudinary_public_id', 'id']
# Register your models here.
admin.site.register(UploadRecord, UploadRecordAdmin)
admin.site.register(ProfilePicture)
