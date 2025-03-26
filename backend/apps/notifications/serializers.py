from rest_framework import serializers
from .models import Notification


# for serializing notification data to JSON
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id',
            'user',
            'notification_title',
            'notification_message',
            'notification_type',
            'info_category',
            'sent_at',
            'scheduled_time',
            'is_read'
        ]
        read_only_fields = ['id', 'sent_at']
