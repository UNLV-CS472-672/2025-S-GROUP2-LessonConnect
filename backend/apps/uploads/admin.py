# uploads/admin.py
from django.contrib import admin
from apps.uploads.models import UploadRecord
# Register your models here.
admin.site.register(UploadRecord)