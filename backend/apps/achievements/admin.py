from django.contrib import admin

# Register your models here.
from .models import Achievement, StudentAchievement

# ai-gen start (ChatGPT-4, 0)
@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'difficulty', 'created_at')
    list_filter = ('difficulty', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)

@admin.register(StudentAchievement)
class StudentAchievementAdmin(admin.ModelAdmin):
    list_display = ('student', 'achievement', 'progress', 'unlocked', 'date_unlocked')
    list_filter = ('unlocked', 'achievement__difficulty', 'date_unlocked')
    search_fields = ('student__user__username', 'achievement__name')
    ordering = ('-date_unlocked', '-created_at')
# ai-gen end
