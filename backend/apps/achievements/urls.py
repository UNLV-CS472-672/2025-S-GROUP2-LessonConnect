from django.urls import path
from . import views

urlpatterns = [
    path("achievements/", views.AchievementListAPIView.as_view(), name="achievement-list"),
    path("student_achievements/", views.StudentAchievementCreateAPIView.as_view(), name="student-achievement-create"),
    path("student_achievements/<int:student_id>/", views.StudentAchievementsByStudentAPIView.as_view(), name="student-achievements-by-student"),
    path("student_achievements/update/<int:pk>/", views.StudentAchievementUpdateAPIView.as_view(), name="student-achievement-update"),
]
