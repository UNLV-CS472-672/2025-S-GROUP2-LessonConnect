from django.urls import path
from apps.uploads.views import UploadListView, UploadDetailView

urlpatterns = [
    # Path to all uploads
    path('', UploadListView.as_view(), name="upload-list"),
    # Path to upload by ID
    path('<str:cloudinary_public_id>/', UploadDetailView.as_view(), name="upload-detail"),
]

