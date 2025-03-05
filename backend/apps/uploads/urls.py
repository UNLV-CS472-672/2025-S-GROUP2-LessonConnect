from django.urls import path
from apps.uploads.views import UploadAPIView

urlpatterns = [
    path('upload/', UploadAPIView.as_view(), name="upload"), #to access add uploads/upload to url
]

