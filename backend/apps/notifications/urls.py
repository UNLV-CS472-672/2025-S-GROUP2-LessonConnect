from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

# https://www.django-rest-framework.org/api-guide/routers/
router = DefaultRouter()
router.register(r'notifications', views.NotificationViewSet, basename='notification')

# the router will generate these URLs:
# GET /notifications/ - List all notifications
# GET /notifications/{id}/ - Get a specific notification
# DELETE /notifications/{id}/ - Delete a specific notification
# DELETE /notifications/?all=true - Clear all notifications
# DELETE /notifications/clear-all/ - Alternative endpoint to delete all notifications
# PATCH /notifications/{id}/mark-read/ - Mark a notification as read
# POST /notifications/mark-all-read/ - Mark all notifications as read

urlpatterns = [
    path('', include(router.urls)),
]