from django.db import models
from django.conf import settings
from django.utils import timezone

class Achievement(models.Model):
    """Defines an achievement that students can unlock."""
    
    class DifficultyLevel(models.TextChoices):
        EASY = 'Easy', 'Easy'
        MEDIUM = 'Medium', 'Medium'
        HARD = 'Hard', 'Hard'

    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    difficulty = models.CharField(
        max_length=50,
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.EASY,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_difficulty_display()})"
    
    class Meta:
        verbose_name = "Achievement"
        verbose_name_plural = "Achievements"


class StudentAchievement(models.Model):
    """Tracks a student's progress and unlocked achievements."""

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    achievement = models.ForeignKey(
        Achievement,
        on_delete=models.CASCADE,
        related_name='student_achievements'
    )
    progress = models.PositiveIntegerField(default=0)
    unlocked = models.BooleanField(default=False)
    date_unlocked = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'achievement')

    def __str__(self):
        status = "Unlocked" if self.unlocked else "In Progress"
        return f"{self.student} - {self.achievement.name} ({status})"

    def update_progress(self, amount=1):
        """Increase progress and check if the achievement is unlocked."""
        if not self.unlocked:
            self.progress += amount
            # You could add logic here: if self.progress >= required_threshold: self.unlock()
            self.save()

    def unlock(self):
        """Unlock the achievement."""
        if not self.unlocked:
            self.unlocked = True
            self.date_unlocked = timezone.now()
            self.save()
    
    class Meta:
        verbose_name = "Student Achievement"
        verbose_name_plural = "Student Achievements"
