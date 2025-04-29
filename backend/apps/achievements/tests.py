from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.achievements.models import Achievement, StudentAchievement
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.db.utils import IntegrityError
from django.db import transaction

User = get_user_model()

class AchievementModelTests(TestCase):
    def setUp(self):
        self.achievement = Achievement.objects.create(
            name="10 Pomodoros",
            description="Complete 10 Pomodoro sessions.",
            difficulty=Achievement.DifficultyLevel.EASY
        )

    def test_str_representation(self):
        self.assertEqual(str(self.achievement), "10 Pomodoros (Easy)")

    def test_defaults(self):
        self.assertIsNotNone(self.achievement.created_at)

class StudentAchievementModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="student1", password="pass")
        self.achievement = Achievement.objects.create(
            name="First Pomodoro",
            description="Complete 1 Pomodoro session.",
            difficulty=Achievement.DifficultyLevel.EASY
        )
        self.student_achievement = StudentAchievement.objects.create(
            student=self.user,
            achievement=self.achievement
        )

    def test_str_representation(self):
        self.assertIn("First Pomodoro", str(self.student_achievement))
        self.assertIn("In Progress", str(self.student_achievement))

    def test_unlock_sets_flag_and_date(self):
        self.student_achievement.unlock()
        self.student_achievement.refresh_from_db()
        self.assertTrue(self.student_achievement.unlocked)
        self.assertIsNotNone(self.student_achievement.date_unlocked)

    def test_update_progress(self):
        self.student_achievement.update_progress(amount=5)
        self.student_achievement.refresh_from_db()
        self.assertEqual(self.student_achievement.progress, 5)

class AchievementAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="apiuser", password="password")
        self.client.force_authenticate(user=self.user)

        self.achievement = Achievement.objects.create(
            name="Test Achievement",
            description="Test Desc",
            difficulty=Achievement.DifficultyLevel.MEDIUM
        )

        self.student_achievement = StudentAchievement.objects.create(
            student=self.user,
            achievement=self.achievement,
            progress=3,
            unlocked=False
        )

    def test_list_achievements(self):
        response = self.client.get(reverse('achievement-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_create_student_achievement(self):
        new_achievement = Achievement.objects.create(
            name="Another Achievement",
            description="Do something hard.",
            difficulty=Achievement.DifficultyLevel.HARD
        )
        response = self.client.post(reverse('studentachievement-list'), {
            "achievement": new_achievement.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_student_achievements_by_student(self):
        url = reverse('studentachievement-by-student', kwargs={'student_id': self.user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_patch_student_achievement_progress(self):
        url = reverse('studentachievement-detail', kwargs={'pk': self.student_achievement.id})
        response = self.client.patch(url, {"progress": 10}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student_achievement.refresh_from_db()
        self.assertEqual(self.student_achievement.progress, 10)
