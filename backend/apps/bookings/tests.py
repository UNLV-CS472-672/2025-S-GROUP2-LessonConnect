from django.test import TestCase
from django.contrib.auth.models import User
from django.utils.timezone import now, timedelta
from apps.users.models import TutorProfile, Profile
from apps.bookings.models import Booking, Availability

class BookingModelTest(TestCase):
    def setUp(self):
        # Create tutor user and profile
        self.tutor_user = User.objects.create_user(username="tutor_user", password="pass")
        self.tutor_profile_base = Profile.objects.create(user=self.tutor_user, role=Profile.TUTOR)
        self.tutor_profile = TutorProfile.objects.create(
            profile=self.tutor_profile_base,
            city="Las Vegas",
            state="NV"
        )

        # Create student user and profile
        self.student_user = User.objects.create_user(username="student_user", password="pass")
        self.student_profile_base = Profile.objects.create(user=self.student_user, role=Profile.STUDENT)

        # Create availability for the tutor
        self.availability = Availability.objects.create(
            tutor=self.tutor_profile,
            start_time=now() + timedelta(days=1),
            end_time=now() + timedelta(days=1, hours=1),
            is_booked=False
        )

    def test_create_booking_sets_availability_booked(self):
        booking = Booking.objects.create(
            student=self.student_user,
            session_price=25.00,
            availability=self.availability
        )
        self.availability.refresh_from_db()
        self.assertTrue(self.availability.is_booked)
        self.assertEqual(booking.booking_status, Booking.PENDING)

    def test_booking_duration(self):
        booking = Booking.objects.create(
            student=self.student_user,
            session_price=25.00,
            availability=self.availability
        )
        expected_duration = timedelta(hours=1)
        self.assertAlmostEqual(
            booking.booking_duration().total_seconds(),
            expected_duration.total_seconds(),
            delta=1  # one second tolerance
        )

    def test_booking_cancellation(self):
        booking = Booking.objects.create(
            student=self.student_user,
            session_price=25.00,
            availability=self.availability
        )

        result = booking.cancel_booking()
        self.assertTrue(result)

        booking.refresh_from_db()
        updated_availability = Availability.objects.get(pk=booking.availability.pk)

        self.assertEqual(booking.booking_status, Booking.CANCELLED)
        self.assertFalse(updated_availability.is_booked)


