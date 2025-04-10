from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from .managers import TutorProfileManager, ProfileManager
from django.core.validators import MaxValueValidator, MinValueValidator
from datetime import date

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
    # see link below...
    CONTACT_METHOD_CHOICES = [
        ('phone', 'Phone'),
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('none', 'None'),
    ]
    user = models.OneToOneField(User, null=False, blank=False, on_delete=models.CASCADE)
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, null=False, blank=False, default=STUDENT)
    # Link the custom manager to the model
    objects = ProfileManager()
    
    phone_number = models.CharField(max_length=15, default="1234567890")
    date_of_birth = models.DateField(default=date.today)
    # https://chatgpt.com/share/67f1a264-1284-8005-91a0-2de951f47cf5
    preferred_contact_method = models.CharField(
        max_length=10,
        choices=CONTACT_METHOD_CHOICES,
        default='email',
    )
    # timezone -> more appropriate as a frontend thing rather than database!

    def __str__(self):
        return self.user.username

# A model that represents information about a user who is a tutor
class TutorProfile(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)

    city = models.CharField(max_length=100, default="Unknown")

    state = models.CharField(max_length=2, default="NA")

    bio = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2)

    subjects = models.ManyToManyField(to="search.Subject")
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=1.0)
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
        return f"{self.profile.user.first_name} {self.profile.user.last_name}"

# A model that represents information for a parent user and their profile
class ParentProfile(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)

    def clean(self):
        if self.profile.role != self.profile.PARENT:
            raise ValidationError("Only profiles with a parent role can have a ParentProfile.")

    # https://chatgpt.com/share/67f811f2-2134-8005-a1c1-28a6f4021014
    def save(self, *args, validate=False, **kwargs):
        # validate if necessary
        if validate:
          self.full_clean()
        # save
        super().save(*args, **kwargs)

    def __str__(self):
        full = f"{self.profile.user.first_name} {self.profile.user.last_name}".strip()
        return full if full else self.profile.user.username


# A model that represents information for a student user and their profile
class StudentProfile(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    # also including a reference to the parent profile
    parent_profile = models.OneToOneField(ParentProfile, on_delete=models.CASCADE)
    # https://stackoverflow.com/questions/849142/how-to-limit-the-maximum-value-of-a-numeric-field-in-a-django-model
    grade_level = models.IntegerField(default=1, validators=[MaxValueValidator(12),MinValueValidator(1)])
    preferred_subjects = models.ManyToManyField(to="search.Subject")
    emergency_contact_name = models.CharField(max_length=100)
    emergency_contact_phone_number = models.CharField(max_length=15)

    def clean(self):
        if self.profile.role != self.profile.STUDENT:
            raise ValidationError("Only profiles with a student role can have a StudentProfile.")

    def save(self, *args, validate=False, **kwargs):
        # validate if necessary
        if validate:
          self.full_clean()
        # save
        super().save(*args, **kwargs)

    def __str__(self):
        full = f"{self.profile.user.first_name} {self.profile.user.last_name}".strip()
        return full if full else self.profile.user.username
