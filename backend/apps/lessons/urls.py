from django.urls import path
from .views import (
    AssignmentDetailView,
    AssignmentCreateView,
)

urlpatterns = [
    # CRUD endpoints for Assignments
    path("assignments/<int:pk>/", AssignmentDetailView.as_view(), name="assignment-detail"),
    path("assignments/create/", AssignmentCreateView.as_view(), name="assignment-create"),
]
