from .models import Notification

'''Helper function(s) for notifications/models.py and notifications/tasks.py '''


def create_notification(user, title, message, notification_type='INFO', schedule_at=None):
    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        schedule_at=schedule_at
    )

    return notification


# TODO: notification delivery functions will be placed here after I figure out the CRUD and websocket shtuff
