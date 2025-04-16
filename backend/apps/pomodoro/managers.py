from django.db import models
from django.utils import timezone

class PomodoroSessionManager(models.Manager):
    def start_session(self, session_id):
        session = self.get(id=session_id)
        session.start_time = timezone.now()
        session.save()

    def pause_session(self, session_id):
        session = self.get(id=session_id)
        session.is_paused = True
        session.save()

    def resume_session(self, session_id):
        session = self.get(id=session_id)
        session.is_paused = False
        session.save()

    def complete_session(self, session_id):
        session = self.get(id=session_id)
        session.is_completed = True
        session.end_time = timezone.now()
        session.save()
