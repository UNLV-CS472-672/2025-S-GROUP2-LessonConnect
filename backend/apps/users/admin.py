from django.contrib import admin
from .models import Profile, TutorProfile, ParentProfile, StudentProfile

admin.site.register(Profile)
admin.site.register(TutorProfile)
admin.site.register(StudentProfile)
admin.site.register(ParentProfile)

