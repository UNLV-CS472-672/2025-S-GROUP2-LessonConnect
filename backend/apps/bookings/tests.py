from django.test import TestCase
from django.contrib.auth.models import User
from django.utils.timezone import now, timedelta
from apps.users.models import TutorProfile, Profile
from apps.bookings.models import Booking, Availability, Review
from rest_framework.test import APITestCase, APIClient
from rest_framework import status


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

class BookingAPITestCase(APITestCase):
    def setUp(self):
        # Create tutor and tutor profile
        self.tutor_user = User.objects.create_user(username='tutor_user', password='pass')
        tutor_profile_base = Profile.objects.create(user=self.tutor_user, role=Profile.TUTOR)
        self.tutor = TutorProfile.objects.create(profile=tutor_profile_base, city="LV", state="NV")

        # Create student and profile
        self.student_user = User.objects.create_user(username='student_user', password='pass')
        Profile.objects.create(user=self.student_user, role=Profile.STUDENT)

        # Authenticated API client
        self.client = APIClient()
        self.client.force_authenticate(user=self.student_user)

        # Availability slot
        self.availability = Availability.objects.create(
            tutor=self.tutor,
            start_time=now() + timedelta(days=1),
            end_time=now() + timedelta(days=1, hours=1),
            is_booked=False
        )

    def test_create_booking_with_viewset(self):
        url = "/bookings/bookings_list/"  # trailing slash is important
        data = {
            "session_price": "30.00",
            "availability": self.availability.id
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_booking_list(self):
        Booking.objects.create(
            student=self.student_user,
            session_price=20.00,
            availability=self.availability
        )
        url = "/bookings/bookings_list/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_reviews(self):
        Review.objects.create(
            tutor=self.tutor,
            reviewer=self.student_user,
            rating=5,
            feedback="Excellent tutor!",
            is_visible=True
        )
        url = "/bookings/reviews/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_submit_review(self):
        url = "/bookings/reviews/submit/"
        data = {
            "tutor": self.tutor.id,
            "rating": 4,
            "feedback": "Very helpful"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_availability_by_tutor_and_date(self):
        date_str = self.availability.start_time.strftime("%Y-%m-%d")
        url = f"/bookings/availability/?tutor_id={self.tutor.id}&date={date_str}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)