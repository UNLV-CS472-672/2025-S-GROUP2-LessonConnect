from django.contrib import admin
from .models import Profile, TutorProfile, Subject, Category

admin.site.register(Profile)
admin.site.register(TutorProfile)
# Thinking to move these to a Search/ app
admin.site.register(Subject)
admin.site.register(Category)
