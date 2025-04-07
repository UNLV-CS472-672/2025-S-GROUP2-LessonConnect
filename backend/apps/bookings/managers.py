from django.db import models
from django.utils.timezone import now
from datetime import timedelta

class BookingManager(models.Manager):
    def get_bookings_by_status(cls, status):
        return cls.objects.filter(booking_status=status)

    def is_expired(self):
        return self.availability.start_time < now()

class ReviewManager(models.Manager):
    def average_rating(self, tutor):
        reviews = self.filter(tutor=tutor)
        total = sum([review.rating for review in reviews])
        return total / len(reviews) if reviews else 0