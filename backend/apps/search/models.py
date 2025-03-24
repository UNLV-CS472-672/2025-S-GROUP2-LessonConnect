from django.db import models
from django.conf import settings

# Create your models here.
class Category(models.Model):
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title

def get_default_category():
    # Assuming the default tutor is the first tutor in the database
    return Category.objects.first()

class Subject(models.Model):
    title = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subjects", default = get_default_category)

    def __str__(self):
        return self.title

class SearchFilters(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="search_filters")
    subjects = models.ManyToManyField(Subject, blank=True)
    min_price = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    max_price = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True)

