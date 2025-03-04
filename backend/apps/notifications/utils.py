from .models import Notification

""" Helper function(s) for notifications/models.py """


# TODO: add schedule_time here once implemented
def create_notification(user, title, message, notification_type='INFO'):
    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
    )

    return notification
