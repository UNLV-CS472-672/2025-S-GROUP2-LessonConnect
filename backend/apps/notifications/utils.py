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


def send_notification_to_channel_layer(channel_layer, user_id, notification):
    """
    Args:
        channel_layer: Channel layer instance
        user_id: ID of the user to send notification to
        notification: Notification object or serialized notification data
    """
    from asgiref.sync import async_to_sync
    from .serializers import NotificationSerializer

    # if notification is a model instance, serialize it
    if hasattr(notification, 'id'):
        serializer = NotificationSerializer(notification)
        notification_data = serializer.data
    else:
        notification_data = notification

    # send to the user's notification group
    async_to_sync(channel_layer.group_send)(
        f'notifications_{user_id}',
        {
            'type': 'notification_event',
            'data': notification_data
        }
    )


def deliver_notification(notification):
    """
    deliver a notification to the user through appropriate channels.
    *****currently just handles WebSocket delivery

    Args:
        notification: Notification object

    Returns:
        bool: True if delivered successfully
    """
    from channels.layers import get_channel_layer

    try:
        channel_layer = get_channel_layer()
        send_notification_to_channel_layer(
            channel_layer,
            notification.user.id,
            notification
        )
        return True
    except Exception as e:
        # log the error in a production environment
        print(f"Failed to deliver notification: {e}")
        return False
