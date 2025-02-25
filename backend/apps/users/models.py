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
  location = models.CharField(max_length=30, blank=True)
  role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, null=True, blank=True)

  def __str__(self):
    return self.user.username

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
  if created:
    Profile.objects.create(user=instance)
  instance.profile.save()
