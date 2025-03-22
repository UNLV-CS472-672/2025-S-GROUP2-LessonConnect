from datetime import timedelta
from celery import shared_task
from django.utils import timezone
from .models import Booking

@shared_task
def mark_expired_bookings():
    threshold_time = timezone.now() - timedelta(weeks=1)
    expired_bookings = Booking.objects.filter(session_date__lt=threshold_time, booking_status="Approved")
    expired_count = expired_bookings.update(booking_status="Expired")
    return f"Marked {expired_count} bookings as expired"

@shared_task
def delete_rejected_bookings():
    threshold_time = timezone.now() - timedelta(hours=24)
    deleted_count, _ = Booking.objects.filter(booking_status="Rejected", session_end_time__lt=threshold_time).delete()
    return f"Deleted {deleted_count} rejected bookings older than 24 hours."