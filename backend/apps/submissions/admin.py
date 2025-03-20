from django.contrib import admin
from .models import Submissions, FileSubmissions, QuizSubmissions, StudentQuizAnswers

@admin.register(Submissions)
class SubmissionsAdmin(admin.ModelAdmin):
    list_display = ("student_profile", "submission_status", "score", "submitted_at")
    search_fields = ("student_profile__user__username",)
    list_filter = ("submission_status",)

@admin.register(FileSubmissions)
class FileSubmissionsAdmin(admin.ModelAdmin):
    list_display = ("submission", "file")

@admin.register(QuizSubmissions)
class QuizSubmissionsAdmin(admin.ModelAdmin):
    list_display = ("submission",)

@admin.register(StudentQuizAnswers)
class StudentQuizAnswersAdmin(admin.ModelAdmin):
    list_display = ("quiz_submission", "student_response", "is_correct")
