from .models import Notification

'''Helper function(s) for notifications/models.py and notifications/tasks.py '''


def create_notification(user, title, message, notification_type='INFO', info_category=None, scheduled_time=None):
    """
    Args:
        user: User object who will receive the notification
        title: Title of the notification
        message: Message content of the notification
        notification_type: Type of notification ('INFO', 'SUCCESS', 'WARNING', 'ERROR')
        info_category: Category for INFO notifications
        scheduled_time: When the notification should be sent (if scheduled)

    Returns:
        Notification object
    """
    notification = Notification.objects.create(
        user=user,
        notification_title=title,
        notification_message=message,
        notification_type=notification_type.lower(),  # ensure lowercase to match model choices
        info_category=info_category,
        scheduled_time=scheduled_time
    )

    return notification

# TODO: notification delivery functions will be placed here after I figure out the CRUD and websocket shtuff
