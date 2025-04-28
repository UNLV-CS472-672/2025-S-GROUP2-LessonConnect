from django.test import TestCase
from django.utils import timezone
from datetime import timedelta, time, date
from django.contrib.auth.models import User
from apps.users.models import Profile
from django.core.exceptions import ValidationError
from decimal import InvalidOperation
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
from apps.planner.models import CalendarEvent
from apps.lessons.models import Assignment

# https://chatgpt.com/share/67d8b158-0d8c-8003-a586-13dc69796303
class CalendarTestCase(TestCase):
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