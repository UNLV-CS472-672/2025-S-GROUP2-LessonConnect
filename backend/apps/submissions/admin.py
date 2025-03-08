from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Submissions, FileSubmissions, QuizSubmissions, StudentQuizAnswers

admin.site.register(Submissions)
admin.site.register(FileSubmissions)
admin.site.register(QuizSubmissions)
admin.site.register(StudentQuizAnswers)
