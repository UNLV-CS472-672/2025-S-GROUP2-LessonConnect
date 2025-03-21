from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from .managers import TutorProfileManager

# https://simpleisbetterthancomplex.com/tutorial/2016/11/23/how-to-add-user-profile-to-django-admin.html
class Profile(models.Model):
  TUTOR = 1
  PARENT = 2
  STUDENT = 3
  ROLE_CHOICES = (
    (TUTOR, 'Tutor'),
    (PARENT, 'Parent'),
    (STUDENT, 'Student'),
  )
  user = models.OneToOneField(User, null=False, blank=False, on_delete=models.CASCADE)
  role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, null=False, blank=False, default=STUDENT)
  def __str__(self):
    return self.user.username

class TutorProfile(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)

    city = models.CharField(max_length=100, default="Unknown")
    #where does the state convert to 2 letters
    state = models.CharField(max_length=2, default="NA")

    bio = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2)

    subjects = models.ManyToManyField(to="search.Subject")

    # Link the custom manager to the model
    objects = TutorProfileManager()

    def clean(self):
        # Ensures that only users with a tutor role
        # can have a tutor profile
        if self.profile.role != self.profile.TUTOR:
            raise ValidationError("Only profiles with a tutor role can have a TutorProfile.")

    def save(self, *args, **kwargs):
        # Always validate before saving
        self.full_clean()
        super().save(*args, **kwargs)

    # Note: Django-watson includes what ever is returned in __str__
    def __str__(self):
        return self.profile.user.username
        #return f"{self.profile.user.first_name} {self.profile.user.last_name}"

