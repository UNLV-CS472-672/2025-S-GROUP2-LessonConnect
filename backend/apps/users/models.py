from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

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
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, null=True, blank=True)
  def __str__(self):
    return self.user.username
