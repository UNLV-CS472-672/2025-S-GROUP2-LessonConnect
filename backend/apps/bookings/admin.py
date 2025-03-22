from django.contrib import admin
from .models import Booking, Review

@admin.register(Booking)
class BookingsAdmin(admin.ModelAdmin):
    list_display = ('session_date', 'tutor', 'student', 'booking_status')
    search_fields = ('tutor__username', 'student__username', 'session_date')
    list_filter = ('booking_status',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['tutor', 'reviewer', 'rating', 'feedback', 'is_visible', 'is_moderated', 'created_at']
    list_filter = ['is_visible', 'is_moderated', 'rating']
    search_fields = ['reviewer__username', 'feedback']
    list_editable = ['is_visible', 'is_moderated']  # Allow inline editing

    def make_visible(self, request, queryset):
        queryset.update(is_visible=True)

    def make_invisible(self, request, queryset):
        queryset.update(is_visible=False)

    actions = [make_visible, make_invisible]

