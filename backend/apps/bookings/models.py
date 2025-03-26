from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.contrib.auth.models import User
import uuid
from datetime import timedelta
from django.utils.timezone import now
from rest_framework.exceptions import ValidationError


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

    session_date = models.DateTimeField()
    session_updated_at = models.DateTimeField(auto_now=True)
    session_end_time = models.DateTimeField(null=True)
    booking_status = models.CharField(max_length=20, choices=BOOKING_STATUS_TYPES, default=PENDING)
    session_price = models.DecimalField(max_digits=10, decimal_places=2)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="student_bookings")
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
        if self.session_date < now():
            return False
        self.session_date = new_date
        self.save()

    def cancel_booking(self):
        if self.session_date < now():
            return False
        self.booking_status = self.REJECTED
        self.save(update_fields=['booking_status'])
        return True

    def booking_duration(self):
        if not self.session_end_time:
            return timedelta(0)
        return self.session_end_time - self.session_date

    @classmethod
    def get_bookings_by_status(cls, status):
        return cls.objects.filter(booking_status=status)

    def is_expired(self):
        return self.session_end_time < now()

    def clean(self):
        if self.session_end_time <= self.session_date:
            raise ValidationError("Session end time must be after the session start time.")

    def save(self, *args, **kwargs):
        """Run full validation before saving."""
        self.full_clean()  # Ensures validation runs before saving
        super().save(*args, **kwargs)


class Review(models.Model):
    tutor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviewer")
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    feedback = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    is_visible = models.BooleanField(default=True)  # Whether the review is visible to others
    is_moderated = models.BooleanField(
        default=False)  # Whether the review has been moderated (e.g., checked for inappropriate content)

    def __str__(self):
        return f"Review for {self.tutor.username} by {self.reviewer.username}"

    class Meta:
        ordering = ['-created_at']  # Sort reviews by most recent first
        unique_together = ('tutor', 'reviewer')

    def is_valid_review(self):
        """Checks if the review has a valid rating and comments."""
        return self.rating is not None and self.feedback.strip() != ""

    @staticmethod
    def average_rating(tutor):
        """Calculates the average rating for a tutor based on all reviews."""
        reviews = Review.objects.filter(tutor=tutor)
        total_rating = sum([review.rating for review in reviews])
        return total_rating / len(reviews) if reviews else 0