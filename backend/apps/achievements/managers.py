from django.db import models
from django.utils import timezone

class StudentAchievementQuerySet(models.QuerySet):
    def unlocked(self):
        return self.filter(unlocked=True)

    def in_progress(self):
        return self.filter(unlocked=False)

    def for_student(self, student):
        return self.filter(student=student)

class StudentAchievementManager(models.Manager):
    def get_queryset(self):
        return StudentAchievementQuerySet(self.model, using=self._db)

    def award_achievement(self, student, achievement, progress=0):
        obj, created = self.get_or_create(
            student=student,
            achievement=achievement,
            defaults={'progress': progress}
        )
        return obj, created

    def update_progress(self, student, achievement, amount=1, threshold=100):
        """Increments progress and unlocks if threshold is met."""
        obj, _ = self.get_or_create(student=student, achievement=achievement)
        if not obj.unlocked:
            obj.progress += amount
            if obj.progress >= threshold:
                obj.unlocked = True
                obj.date_unlocked = timezone.now()
            obj.save()
        return obj
