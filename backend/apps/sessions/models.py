from django.db import models
from django.utils import timezone
from apps.users.models import Profile


class Session(models.Model):
    # session participants
    student = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='student_sessions',
                                limit_choices_to={'role': Profile.STUDENT})
    tutor = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='tutor_sessions',
                              limit_choices_to={'role': Profile.TUTOR})

    # session details
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    # location details
    location = models.CharField(max_length=200, blank=True, null=True)
    is_virtual = models.BooleanField(default=True)
    meeting_link = models.URLField(blank=True, null=True)

    # session status
    SCHEDULED = 'scheduled'
    COMPLETED = 'completed'
    CANCELED = 'canceled'

    STATUS_CHOICES = [
        (SCHEDULED, 'Scheduled'),
        (COMPLETED, 'Completed'),
        (CANCELED, 'Canceled')
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=SCHEDULED)

    # for reminders
    reminder_sent = models.BooleanField(default=False)

    # for tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.start_time.strftime('%Y-%m-%d %H:%M')}"

    def is_upcoming(self):
        """check if session is in the future"""
        return self.start_time > timezone.now()

    def duration_minutes(self):
        """calculate session duration in minutes"""
        delta = self.end_time - self.start_time
        return delta.total_seconds() // 60

    class Meta:
        ordering = ['-start_time']
