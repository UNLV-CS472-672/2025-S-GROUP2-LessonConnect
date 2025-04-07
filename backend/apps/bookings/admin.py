from django.contrib import admin
from .models import Booking, Review, Availability

@admin.register(Booking)
class BookingsAdmin(admin.ModelAdmin):
    list_display = ('student', 'get_tutor', 'booking_status')
    search_fields = ('availability__tutor__profile__user__username', 'student__username')
    list_filter = ('booking_status',)

    def get_tutor(self, obj):
        """Displays tutor username in the admin panel."""
        return obj.availability.tutor.profile.user.username

    get_tutor.short_description = 'Tutor'  # Renames column in admin panel

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('tutor', 'start_time', 'end_time', 'is_booked')
    search_fields = ('tutor__profile__user__username',)  # Allows searching by tutor's username
    list_filter = ('is_booked',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['get_tutor', 'reviewer', 'rating', 'feedback', 'is_visible', 'is_moderated', 'created_at']
    list_filter = ['is_visible', 'is_moderated', 'rating']
    search_fields = ['tutor__profile__user__username', 'reviewer__username', 'feedback']
    list_editable = ['is_visible', 'is_moderated']  # Allow inline editing

    def get_tutor(self, obj):
        """Displays tutor username in the admin panel."""
        return obj.tutor.profile.user.username
    get_tutor.short_description = 'Tutor'  # Renames column in admin panel

    def make_visible(self, request, queryset):
        queryset.update(is_visible=True)

    def make_invisible(self, request, queryset):
        queryset.update(is_visible=False)

    actions = [make_visible, make_invisible]

