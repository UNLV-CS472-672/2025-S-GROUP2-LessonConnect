from django.contrib import admin
from .models import Notification

admin.site.register(Notification)


class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'notification_title', 'notification_type', 'info_category', 'is_read', 'sent_at', 'scheduled_time')
    list_filter = ('notification_type', 'info_category', 'is_read', 'sent_at', 'scheduled_time')
    search_fields = ('user__username', 'notification_title', 'notification_message')
    date_hierarchy = 'sent_at'
    actions = ['mark_as_read', 'mark_as_unread']

    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} notifications marked as read.')

    mark_as_read.short_description = 'Mark selected notifications as read'

    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f'{updated} notifications marked as unread.')

    mark_as_unread.short_description = 'Mark selected notifications as unread'
