from django.db import models
from django.apps import apps
from django.utils import timezone

class CalendarEventManager(models.Manager):
    def upcoming_events(self):
        """Get events that occur in the future."""
        return self.filter(date__gte=timezone.now().date())

    def past_events(self):
        """Get events that have already occurred."""
        return self.filter(date__lt=timezone.now().date())

    def events_for_date(self, date):
        """Get events for a specific date."""
        return self.filter(date=date)

    def events_by_type(self, event_type):
        """Get events by event type."""
        return self.filter(event_type=event_type)