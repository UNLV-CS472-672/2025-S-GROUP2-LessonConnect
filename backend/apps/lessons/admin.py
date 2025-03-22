from django.contrib import admin
from .models import Assignment, Quiz, Question, Choice, Solution

admin.site.register(Assignment)
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Choice)
admin.site.register(Solution)
