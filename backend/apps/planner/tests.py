from django.test import TestCase
from django.utils import timezone
from datetime import timedelta, time, date
from django.contrib.auth.models import User
from apps.users.models import Profile
from django.core.exceptions import ValidationError
from decimal import InvalidOperation
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from django.urls import reverse
from apps.planner.models import CalendarEvent
from apps.lessons.models import Assignment

# Model Tests
# https://chatgpt.com/share/680fcc53-47b4-800c-b923-2e9fae8e48b0 
class CalendarModelTestCase(TestCase):
    def setUp(self):
        # Create user and student profile
        self.user = User.objects.create_user(username="student1", password="password")
        self.profile = Profile.objects.create(user=self.user, role=3)  # Assign student role

        self.assignment = Assignment.objects.create(
            title="Initial Assignment",
            description="Initial assignment description.",            
            assignment_type="QZ",
            deadline="2025-12-01T12:00:00Z",
        )

        now = timezone.now()
        self.event = CalendarEvent.objects.create(
            title="Test Event",
            date=now.date() + timedelta(days=1),
            start_time=time(10, 0),
            end_time=time(11, 0),
            event_type=CalendarEvent.LESSON,
            related_task=self.assignment,
        )

        self.client = APIClient()
        url = reverse('token_obtain_pair')  # Update to the correct token URL if necessary
        response = self.client.post(url, {'username': 'student1', 'password': 'password'}, format='json')
        self.token = response.data['access']

    def clone_event(self, **overrides):
        """
        Helper to clone the existing event with optional overrides
        """
        kwargs = {
            'title': self.event.title,
            'date': self.event.date,
            'start_time': self.event.start_time,
            'end_time': self.event.end_time,
            'event_type': self.event.event_type,
            'related_task': self.assignment,
            'location': self.event.location,
            'virtual': self.event.virtual,
        }
        kwargs.update(overrides)
        return CalendarEvent(**kwargs)
    
    # models.py
    def test_calendar_event_str(self):
        expected_str = f"Test Event (Lesson) on {self.event.date} from 10:00:00 to 11:00:00"
        self.assertEqual(str(self.event), expected_str)

    def test_valid_event(self):
        event = self.clone_event()
        event.clean()
    
    def test_end_time_before_start_time(self):
        event = self.clone_event(start_time=time(15, 0), end_time=time(13, 0))
        with self.assertRaises(ValidationError):
            event.clean()

    def test_missing_end_time(self):
        event = self.clone_event(end_time=None)
        with self.assertRaises(ValidationError):
            event.clean()

    def test_event_in_past_date(self):
        event = self.clone_event(date=timezone.now().date() - timedelta(days=1))
        with self.assertRaises(ValidationError):
            event.clean()

    def test_event_start_time_today_but_in_past(self):
        now = timezone.now()
        if now.hour >= 1:
            event = self.clone_event(
                date=now.date(),
                start_time=(now - timedelta(hours=1)).time(),
                end_time=(now + timedelta(hours=1)).time(),
            )
            with self.assertRaises(ValidationError):
                event.clean()

    # managers.py
    def test_upcoming_events(self):
        upcoming = CalendarEvent.objects.upcoming_events()
        self.assertIn(self.event, upcoming)
        
        # Add a past event to make sure it's excluded
        past_event = CalendarEvent.objects.create(
            title="Past Event",
            date=timezone.now().date() - timedelta(days=1),
            start_time=time(9, 0),
            end_time=time(10, 0),
            event_type=CalendarEvent.REMINDER,
        )
        upcoming = CalendarEvent.objects.upcoming_events()
        self.assertNotIn(past_event, upcoming)

    def test_past_events(self):
        past_event = CalendarEvent.objects.create(
            title="Old Event",
            date=timezone.now().date() - timedelta(days=2),
            start_time=time(8, 0),
            end_time=time(9, 0),
            event_type=CalendarEvent.MEETING,
        )
        past_events = CalendarEvent.objects.past_events()
        self.assertIn(past_event, past_events)
        self.assertNotIn(self.event, past_events)

    def test_events_for_specific_date(self):
        same_day_event = CalendarEvent.objects.create(
            title="Same Day Event",
            date=self.event.date,
            start_time=time(12, 0),
            end_time=time(13, 0),
            event_type=CalendarEvent.PRACTICE,
        )
        events = CalendarEvent.objects.events_for_date(self.event.date)
        self.assertIn(self.event, events)
        self.assertIn(same_day_event, events)
        self.assertEqual(events.count(), 2)

    def test_events_by_type(self):
        type_event = CalendarEvent.objects.create(
            title="Meeting Event",
            date=timezone.now().date() + timedelta(days=2),
            start_time=time(14, 0),
            end_time=time(15, 0),
            event_type=CalendarEvent.MEETING,
        )
        meeting_events = CalendarEvent.objects.events_by_type(CalendarEvent.MEETING)
        self.assertIn(type_event, meeting_events)
        self.assertNotIn(self.event, meeting_events)

# Endpoint Tests
# https://chatgpt.com/share/680fd2aa-b6a8-800c-9aa4-3c15d2bdd21d
class CalendarEventAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="student1", password="password")
        self.profile = Profile.objects.create(user=self.user, role=3)

        self.assignment = Assignment.objects.create(
            title="Test Assignment",
            description="Assignment for event",
            assignment_type="QZ",
            deadline="2025-12-01T12:00:00Z",
        )

        self.login_url = reverse("token_obtain_pair")
        self.event_url = reverse("calendarevent-list")

        response = self.client.post(self.login_url, {
            "username": "student1",
            "password": "password"
        }, format="json")
        self.token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    def test_create_event(self):
        tomorrow = timezone.now() + timedelta(days=1)
        data = {
            "title": "API Event",
            "date": str(tomorrow.date()),
            "start_time": "10:00:00",
            "end_time": "11:00:00",
            "event_type": CalendarEvent.LESSON,
            "related_task": self.assignment.id,
        }
        response = self.client.post(self.event_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CalendarEvent.objects.count(), 1)
        self.assertEqual(CalendarEvent.objects.first().title, "API Event")

    def test_get_event_list(self):
        event = CalendarEvent.objects.create(
            title="List Test",
            date=timezone.now().date() + timedelta(days=1),
            start_time=time(9, 0),
            end_time=time(10, 0),
            event_type=CalendarEvent.MEETING,
            related_task=self.assignment,
        )
        response = self.client.get(self.event_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_invalid_event_times(self):
        tomorrow = timezone.now() + timedelta(days=1)
        data = {
            "title": "Invalid Time",
            "date": str(tomorrow.date()),
            "start_time": "13:00:00",
            "end_time": "11:00:00",  # End before start
            "event_type": CalendarEvent.LESSON,
            "related_task": self.assignment.id,
        }
        response = self.client.post(self.event_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("End time must be after the start time", str(response.data))

    def test_unauthorized_access(self):
        self.client.credentials()  # Clear auth
        response = self.client.get(self.event_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_event(self):
        event = CalendarEvent.objects.create(
            title="Old Title",
            date=timezone.now().date() + timedelta(days=1),
            start_time=time(10, 0),
            end_time=time(11, 0),
            event_type=CalendarEvent.MEETING,
            related_task=self.assignment,
        )
        url = reverse("calendarevent-detail", args=[event.id])
        data = {
            "title": "Updated Title",
            "date": str(event.date),
            "start_time": "10:00:00",
            "end_time": "11:00:00",
            "event_type": event.event_type,
            "related_task": self.assignment.id
        }
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "Updated Title")

    def test_partial_update_event(self):
        event = CalendarEvent.objects.create(
            title="Patch Me",
            date=timezone.now().date() + timedelta(days=1),
            start_time=time(9, 0),
            end_time=time(10, 0),
            event_type=CalendarEvent.LESSON,
            related_task=self.assignment,
        )
        url = reverse("calendarevent-detail", args=[event.id])
        response = self.client.patch(url, {"title": "Patched Title"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "Patched Title")

    def test_delete_event(self):
        event = CalendarEvent.objects.create(
            title="Delete Me",
            date=timezone.now().date() + timedelta(days=1),
            start_time=time(9, 0),
            end_time=time(10, 0),
            event_type=CalendarEvent.REMINDER,
            related_task=self.assignment,
        )
        url = reverse("calendarevent-detail", args=[event.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(CalendarEvent.objects.filter(id=event.id).exists())

    def test_get_single_event(self):
        event = CalendarEvent.objects.create(
            title="Single Event",
            date=timezone.now().date() + timedelta(days=1),
            start_time=time(8, 0),
            end_time=time(9, 0),
            event_type=CalendarEvent.PRACTICE,
            related_task=self.assignment,
        )
        url = reverse("calendarevent-detail", args=[event.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "Single Event")