from django.urls import path
from .views import (
    StartPomodoroSession,
    PausePomodoroSession,
    ResumePomodoroSession,
    CancelPomodoroSession,
    CompletePomodoroSession,
    GetPomodoroSessionStatus,
    GetPomodoroSessionHistory,
)

urlpatterns = [
    path('api/pomodoro-session/<int:id>/start/', StartPomodoroSession.as_view(), name="start_pomodoro"),
    path('api/pomodoro-session/<int:id>/pause/', PausePomodoroSession.as_view(), name="pause_pomodoro"),
    path('api/pomodoro-session/<int:id>/resume/', ResumePomodoroSession.as_view(), name="resume_pomodoro"),
    path('api/pomodoro-session/<int:id>/cancel/', CancelPomodoroSession.as_view(), name="cancel_pomodoro"),
    path('api/pomodoro-session/<int:id>/complete/', CompletePomodoroSession.as_view(), name="complete_pomodoro"),
    path('api/pomodoro-session/<int:id>/status/', GetPomodoroSessionStatus.as_view(), name="pomodoro_status"),
    path('api/pomodoro-session/history/', GetPomodoroSessionHistory.as_view(), name="pomodoro_history"),
]
