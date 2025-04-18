from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.contrib.auth.models import User
import uuid
from datetime import timedelta
from django.utils.timezone import now
from rest_framework.exceptions import ValidationError
from apps.users.models import TutorProfile
from apps.bookings.managers import ReviewManager, BookingManager


class Availability(models.Model):
    """Defines available time slots for tutors."""
    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name="availabilities")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"Availability: {self.tutor.profile.user.username} from {self.start_time} to {self.end_time}"

    def clean(self):
        if self.end_time <= self.start_time:
            raise ValidationError("End time must be after start time.")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['start_time', 'tutor'], name='unique_time_slot')
        ]
        ordering = ['start_time', 'tutor']

class Booking(models.Model):
    PENDING = 'Pending'
    APPROVED = 'Approved'
    REJECTED = 'Rejected'
    EXPIRED = 'Expired'
    CANCELLED = 'Cancelled'
    FULFILLED = 'Fulfilled'

    BOOKING_STATUS_TYPES = [
        (PENDING, 'Pending'),
        (APPROVED, 'Approved'),
        (REJECTED, 'Rejected'),
        (EXPIRED, 'Expired'),
        (CANCELLED, 'Cancelled'),
        (FULFILLED, 'Fulfilled'),
    ]

    session_updated_at = models.DateTimeField(auto_now=True)
    booking_status = models.CharField(max_length=20, choices=BOOKING_STATUS_TYPES, default=PENDING)
    session_price = models.DecimalField(max_digits=10, decimal_places=2)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="student_bookings")
    description = models.TextField(null=True, blank=True)
    payment_gateway_ref = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    availability = models.OneToOneField(Availability, on_delete=models.CASCADE, related_name="availability_booking", null=True, blank=True)

    objects = BookingManager()

    def __str__(self):
        return (f'Booking for {self.student.username} with {self.availability.tutor.profile.user.username} '
                f'on {self.availability.start_time} - {self.booking_status}')

    def is_paid(self):
        return self.payment_gateway_ref is not None

    def reschedule_booking(self, new_availability):
        if self.availability.start_time < now():
            return False
        self.availability = new_availability
        self.save(update_fields=['availability'])
        return True

    def cancel_booking(self):
        if self.availability.start_time < now():
            return False
        self.booking_status = self.CANCELLED
        self.availability.is_booked = False  # Mark slot as available again
        self.availability.save(update_fields=['is_booked'])
        self.save(update_fields=['booking_status'])
        return True

    def booking_duration(self):
        if not self.availability.end_time:
            return timedelta(0)
        return self.availability.end_time - self.availability.start_time

    def clean(self):
        if self.availability.end_time <= self.availability.start_time:
            raise ValidationError("Session end time must be after the session start time.")
        elif self.availability.is_booked:
            raise ValidationError("This time slot is already booked.")

    def save(self, *args, **kwargs):
        """Run full validation before saving."""
        self.full_clean()  # Ensures validation runs before saving
        self.availability.is_booked = True

        if not self.availability:
            self.availability = Availability.objects.create(
                tutor=self.student.Tu,  # Assuming student books a tutor
                start_time=self.session_date,
                end_time=self.session_end_time or (self.session_date + timedelta(hours=1)),
                is_booked=True
            )

        super().save(*args, **kwargs)

class Review(models.Model):
    tutor = models.ForeignKey(TutorProfile, on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviewer")
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    feedback = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    is_visible = models.BooleanField(default=True)  # Whether the review is visible to others
    is_moderated = models.BooleanField(default=False)

    objects = ReviewManager()

    def __str__(self):
        return f"Review for {self.tutor.profile.user.username} by {self.reviewer.username}"

    class Meta:
        ordering = ['-created_at']
        unique_together = ('tutor', 'reviewer')

    def is_valid_review(self):
        return self.rating is not None and self.feedback.strip() != ""
