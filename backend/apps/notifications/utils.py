from .models import Notification

'''Helper function(s) for notifications/models.py and notifications/tasks.py '''


# TODO: add schedule_time here once implemented
def create_notification(user, title, message, notification_type='INFO'):
    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
    )

    return notification


# TODO: notification delivery functions will be placed here after I figure out the CRUD and websocket shtuff
