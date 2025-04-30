from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import CalendarEvent, UnscheduledTask
from .serializers import CalendarEventSerializer, UnscheduledTaskSerializer


class CalendarEventViewSet(viewsets.ModelViewSet):
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer


# ------------------------------
class UnscheduledTaskViewSet(viewsets.ModelViewSet):
    """
    retrieve: Return a single unscheduled task.
    list: Return all unscheduled tasks.
    create: Create a new unscheduled task.
    update: Update an existing unscheduled task.
    partial_update: Partially update fields on an unscheduled task.
    delete: Delete an unscheduled task.
    """
    queryset = UnscheduledTask.objects.all()
    serializer_class = UnscheduledTaskSerializer
    permission_classes = [permissions.IsAuthenticated]
