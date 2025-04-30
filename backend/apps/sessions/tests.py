from django.test import TestCase
from django.utils import timezone
import datetime
from django.contrib.auth.models import User
from apps.users.models import Profile
from apps.sessions.models import Session


class SessionModelTest(TestCase):
    def setUp(self):
        # create test users
        self.student_user = User.objects.create_user(
            username='teststudent',
            email='student@example.com',
            password='testpass123'
        )

        self.tutor_user = User.objects.create_user(
            username='testtutor',
            email='tutor@example.com',
            password='testpass123'
        )

        # Create profiles
        self.student_profile = Profile.objects.create(
            user=self.student_user,
            role=Profile.STUDENT
        )

        self.tutor_profile = Profile.objects.create(
            user=self.tutor_user,
            role=Profile.TUTOR
        )

    def test_session_creation(self):
        # create a session
        now = timezone.now()
        session = Session.objects.create(
            student=self.student_profile,
            tutor=self.tutor_profile,
            title="Test Session",
            description="This is a test session",
            start_time=now + datetime.timedelta(hours=2),
            end_time=now + datetime.timedelta(hours=3),
            is_virtual=True
        )

        # test basic properties
        self.assertEqual(session.title, "Test Session")
        self.assertEqual(session.student, self.student_profile)
        self.assertEqual(session.tutor, self.tutor_profile)
        self.assertEqual(session.duration_minutes(), 60)
        self.assertTrue(session.is_upcoming())
        self.assertFalse(session.reminder_sent)

        # test status
        self.assertEqual(session.status, Session.SCHEDULED)

        # test string representation
        expected_str = f"Test Session - {(now + datetime.timedelta(hours=2)).strftime('%Y-%m-%d %H:%M')}"
        self.assertEqual(str(session), expected_str)
