from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from apps.planner.managers import CalendarEventManager

class CalendarEvent(models.Model):
    # Constants for event type choices
    LESSON = 'lesson'
    MEETING = 'meeting'
    REMINDER = 'reminder'
    PRACTICE = 'practice'

    EVENT_TYPES = [
        (LESSON, 'Lesson'),
        (MEETING, 'Meeting'),
        (REMINDER, 'Reminder'),
        (PRACTICE, 'Practice')
    ]

    # Calendar event fields 
    title = models.CharField(max_length=63)
    date = models.DateField(blank=False, null=False)
    start_time = models.TimeField(blank=False, null=False)
    end_time = models.TimeField(blank=False, null=False)
    description = models.TextField(blank=True, null=True) 
    # related_unscheduled_task = models.ForeignKey(UnscheduledTask, on_delete=models.CASCADE, blank=True, null=True)
    related_task = models.ForeignKey(
        'lessons.Assignment', 
        on_delete=models.CASCADE, 
        blank=True,
        null=True
    )
    event_type = models.CharField(
        max_length=20,
        choices=EVENT_TYPES,
        default=LESSON
    )
    location = models.TextField(blank=True, null=True) 
    virtual = models.BooleanField(default=False)

    objects = CalendarEventManager()

    class Meta:
        # For human readability and clarity
        verbose_name = "Calendar Event"
        verbose_name_plural = "Calendar Events"
    
    def __str__(self):
        # To assist with debuging 
        return (
            f"{self.title} ({self.get_event_type_display()}) "
            f"on {self.date} from {self.start_time} to {self.end_time}"
        )

    def clean(self):
        # Ensure that the start_time is before the end_time
        if self.start_time and self.end_time: # Not null 
            if self.start_time >= self.end_time:
                raise ValidationError("End time must be after the start time.")
        # Ensure that both start and end time are provided
        elif self.start_time or self.end_time:
            raise ValidationError("Both start time and end time must be provided.")
        
        # Ensure the event is not scheduled in the past
        if self.start_time and self.end_time: # not null 
            if self.date < timezone.now().date():
                raise ValidationError("The event date cannot be in the past.")
            elif self.date == timezone.now().date() and self.start_time < timezone.now().time():
                raise ValidationError("The event start time cannot be in the past.")