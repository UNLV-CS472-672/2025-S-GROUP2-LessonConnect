# uploads/admin.py
from django.contrib import admin
from apps.uploads.models import UploadRecord
# Debug Only
class UploadRecordAdmin(admin.ModelAdmin):
    list_display=['public_id', 'id']
# Register your models here.
admin.site.register(UploadRecord, UploadRecordAdmin)