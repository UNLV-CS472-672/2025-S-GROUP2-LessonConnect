from django.db import models
from django.conf import settings  # used for accessing AUTH_USER_MODEL
from django.utils import timezone  # used for auto-setting the create_at/sent_at timestamp


class Notification(models.Model):
    # constants for notifications types. can add more to if needed
    INFO = 'info'
    SUCCESS = 'success'
    WARNING = 'warning'
    ERROR = 'error'

    # constants for INFO subcategories. can add more to if needed. open to suggestions
    INFO_GENERAL = 'general'
    INFO_SYSTEM = 'system'

    # choices for the notification_type field. the elements in the list is
    # a tuple of (value, display_name)
    NOTIFICATION_TYPES = [
        (INFO, 'Information'),
        (SUCCESS, 'Success'),
        (WARNING, 'Warning'),
        (ERROR, 'Error')
    ]

    # choices for INFO subcategories
    INFO_CATEGORIES = [
        (INFO_GENERAL, 'General Information'),
        (INFO_SYSTEM, 'System Update')
    ]

    # links to the user who will receive notifications
    # on_delete=CASCADE means that if the user is deleted, their notifs will be deleted too
    # related_name='notifications' gets all notifs for a user
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications',
                             default=settings.AUTH_USER_MODEL.objects.first())

    # notification message content
    notification_title = models.CharField(max_length=63)
    notification_message = models.TextField()

    notification_type = models.CharField(
        max_length=20,  # maybe increase length if we want lengthy notifications?
        choices=NOTIFICATION_TYPES,
        default=INFO  # defaults to 'info' if author does not specify
    )

    # INFO subcategory. only relevant when notification_type is INFO
    info_category = models.CharField(
        max_length=20,
        choices=INFO_CATEGORIES,
        default=INFO_GENERAL,
        blank=True,
        null=True
    )

    # when notification was created
    sent_at = models.DateTimeField(default=timezone.now)

    # for schedule notifications
    scheduled_time = models.DateTimeField(blank=True, null=True)

    # tracks if user had read the notification
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-sent_at']  # ordering notifications with the newest first

    # string representation of the notification
    # will show first 20 char to avoid lengthy strings
    def __str__(self):
        return f"Notification for {self.user}: {self.notification_message[:20]}"

    def mark_as_read(self):
        self.is_read = True
        self.save(update_fields=['is_read'])

    def mark_as_sent(self):
        self.sent_at = True
        self.save(update_fields=['sent_at'])

    @property
    def is_scheduled(self):
        # checks if notification is scheduled
        return self.scheduled_time is not None

    # --- AI GENERATED CODE
    # https://chatgpt.com/share/67c91721-0abc-800d-a8df-4c97476f7398
    @property
    def info_subcategory(self):
        """Returns the display name of the info category if notification type is INFO."""
        if self.notification_type == self.INFO:
            return dict(self.INFO_CATEGORIES).get(self.info_category, "Unknown")
        return None
