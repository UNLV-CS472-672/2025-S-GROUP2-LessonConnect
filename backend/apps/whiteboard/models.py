from django.db import models
from django.conf import settings
from .managers import BoardManager

# Create your models here.
class Room(models.Model):
    name = models.CharField(max_length=128)
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)

    # Link the custom manager to the model
    objects = BoardManager()

    def __str__(self):
        return f"{self.name}"
