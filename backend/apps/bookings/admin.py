from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('session_date', 'tutor', 'student', 'booking_status')
    search_fields = ('tutor__username', 'student__username', 'session_date')
    list_filter = ('booking_status',)
