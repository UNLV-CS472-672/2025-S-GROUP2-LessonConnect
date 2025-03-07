from django.urls import path
from apps.uploads.views import UploadAPIView

urlpatterns = [
    # Path to all uploads
    path('uploads/', UploadListView.as_view(), name="upload-list"),
    # Path to upload by ID
    path('uploads/<uuid:public_id>/', UploadDetailView.as_view(), name="upload-detail"),
]

