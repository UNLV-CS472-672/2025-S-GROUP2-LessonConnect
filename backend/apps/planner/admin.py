from django.contrib import admin
from .models import CalendarEvent

@admin.register(CalendarEvent)
class CalendarEventAdmin(admin.ModelAdmin):
    list_display = ("title", "date", "start_time", "end_time", "event_type", "related_task")
    