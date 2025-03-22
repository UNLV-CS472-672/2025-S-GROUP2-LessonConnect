from django.db import models
from django.contrib.auth.models import User
import uuid
from datetime import timedelta
from django.utils.timezone import now


class Booking(models.Model):
    PENDING = 'Pending'
    APPROVED = 'Approved'
    REJECTED = 'Rejected'

    BOOKING_STATUS_TYPES = [
        (PENDING, 'Pending'),
        (APPROVED, 'Approved'),
        (REJECTED, 'Rejected'),
    ]

    session_date = models.DateTimeField()
    session_updated_at = models.DateTimeField(auto_now=True)
    booking_status = models.CharField(max_length=20, choices=BOOKING_STATUS_TYPES, default=PENDING)
    session_price = models.DecimalField(max_digits=10, decimal_places=2)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="student")
    tutor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tutor")
    description = models.TextField(null=True, blank=True)
    payment_gateway_ref = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['session_date', 'tutor'], name='unique_session_per_tutor')
        ]
        ordering = ['session_date', 'tutor']

    def __str__(self):
        return (f'Booking on {self.session_date.strftime("%Y-%m-%d %H:%M")} '
                f'with {self.tutor.username} - {self.booking_status}')

    def is_paid(self):
        return self.payment_gateway_ref is not None

    def reschedule_booking(self, new_date):
        self.session_date = new_date
        self.save()

    def cancel_booking(self):
        if self.session_date < now():
            return False
        self.booking_status = self.REJECTED
        self.save()
        return True

    def booking_end_time(self, duration_in_minutes=60):
        return self.session_date + timedelta(minutes=duration_in_minutes)

    @classmethod
    def get_bookings_by_status(cls, status):
        return cls.objects.filter(booking_status=status)
