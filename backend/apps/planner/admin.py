from django.contrib import admin
from .models import CalendarEvent, UnscheduledTask

@admin.register(CalendarEvent)
class CalendarEventAdmin(admin.ModelAdmin):
    list_display = ("title", "date", "start_time", "end_time", "event_type", "related_task")

@admin.register(UnscheduledTask)
class UnscheduledTaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'due_date', 'assigned_assignment', 'created_at')
    list_filter = ('assigned_assignment',)
    search_fields = ('title', 'description')
