from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Notification
from .serializers import NotificationSerializer

""" 
ViewSet for handling Notification CRUD operations.
  
- GET /notifications/: Fetch all notifications (like a notification history).
- GET /notifications/{id}/: Get a single notification’s details.
- POST /notifications/mark-all-read/: Mark all notifications as read.
- PATCH /notifications/{id}/mark-read/: Mark a specific notification as read.
- DELETE /notifications/: Clear all notifications
"""


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    # return notifications for the authenticated user only.
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    # ensure notification is created for the current user.
    def perform_create(self, serializer):
        notification = serializer.save(user=self.request.user, sender=self.request.user)

        # try to deliver the notification via WebSocket
        from .utils import deliver_notification
        deliver_notification(notification)

    # GET /notifications/: Fetch all notifications
    def list(self, request, *args, **kwargs):
        # if the '?all=true' query param is present with a DELETE method, clear all notifications instead.
        if request.method == 'DELETE' and request.query_params.get('all') == 'true':
            count = self.get_queryset().count()
            self.get_queryset().delete()
            return Response({'status': f'All {count} notifications deleted'}, status=status.HTTP_204_NO_CONTENT)
        return super().list(request, *args, **kwargs)

    """ 
    CUSTOM ENDPOINT FUNCTIONS
    https://djangocentral.com/how-to-use-action-decorator-in-django-rest-framework/
    """

    # PATCH /notifications/{id}/mark-read/ - Mark a specific notification as read.
    @action(detail=True, methods=['patch'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.mark_as_read()
        return Response({'status': 'notification marked as read'})

    #  POST /notifications/mark-all-read/ - Mark all notifications as read.
    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        notifications = self.get_queryset().filter(is_read=False)
        count = notifications.count()
        for notification in notifications:
            notification.mark_as_read()
        return Response({'status': f'{count} notifications marked as read'})

    # DELETE /notifications/clear-all/ - Delete all notifications.
    # this is an alternative to using DELETE /notifications/?all=true (see: def list())
    @action(detail=False, methods=['delete'], url_path='clear-all')
    def clear_all(self, request):
        count = self.get_queryset().count()
        self.get_queryset().delete()
        return Response({'status': f'All {count} notifications deleted'}, status=status.HTTP_204_NO_CONTENT)
