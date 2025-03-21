from django.db import models

# Create your models here.
from django.conf import settings
from django.utils import timezone

class PomodoroSession(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    duration = models.IntegerField(default=25)  # Duration in minutes (user sets this)
    is_completed = models.BooleanField(default=False)
    task_description = models.TextField(blank=True, null=True)
    pet_earned = models.BooleanField(default=False)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Pomodoro Session ({self.start_time}) - {self.end_time}"
   
    class Meta:
        verbose_name = "Pomodoro Session"
        verbose_name_plural = "Pomodoro Sessions"

class PetCatalog(models.Model):
    # Constants for rarity
    COMMON = 'common'
    RARE = 'rare'
    EPIC = 'epic'
    LEGENDARY = 'legendary'

    # Choices for the rarity field
    RARITY_CHOICES = [
        (COMMON, 'Common'),
        (RARE, 'Rare'),
        (EPIC, 'Epic'),
        (LEGENDARY, 'Legendary'),
    ]

    name = models.CharField(max_length=100) # Name of pet
    pet_type = models.CharField(max_length=100) # Species/type of pet
    image = models.ImageField(upload_to='pet_images', null=True, blank=True) # Change upload path later
    description = models.TextField()
    rarity = models.CharField(max_length=50, choices=RARITY_CHOICES)
    drop_rate = models.FloatField()  # Probability of getting this pet

    def __str__(self):
        return f"{self.name} ({self.rarity})"
   
    class Meta:
        verbose_name = "Pet Catalog"
        verbose_name_plural = "Pet Catalogs"

class PetCollection(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    pet_catalog = models.ForeignKey(PetCatalog, on_delete=models.CASCADE)
    acquired_at = models.DateTimeField(auto_now_add=True) # Time pet was earned
    is_active = models.BooleanField(default=False)  # Indicates if the pet is currently active

    def __str__(self):
        return f"{self.pet_catalog.name}"

    class Meta:
        verbose_name = "Pet Collection"
        verbose_name_plural = "Pet Collections"
