from celery import shared_task
from django.utils import timezone
from .models import Notification

# TODO: this is where I'll create the celery tasks for the session and assignment reminders (6th PR)

@shared_task
def process_scheduled_notifications():
    now = timezone.now()

    # find notifications scheduled for now or earlier that haven't been sent yet
    pending_notifications = Notification.objects.filter(
        scheduled_time__lte=now,  # scheduled_time is earlier than or equal to now
        sent_at__isnull=True  # hasn't been sent yet
    )

    num_of_notifs = 0  # mainly used for debugging purposes. can remove later
    for notification in pending_notifications:
        from .utils import deliver_notification
        delivered = deliver_notification(notification)

        if delivered:
            notification.mark_as_sent()
            num_of_notifs += 1

        notification.mark_as_sent()
        num_of_notifs += 1

    return f"Processed {num_of_notifs} scheduled notifications"
