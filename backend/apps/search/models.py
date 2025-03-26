from django.db import models
from django.conf import settings

# Create your models here.

# A model that represents the possible categories that a subject can belong to
# (i.e. Category: Math can have Subjects: Calculus, Linear Algebra)
class Category(models.Model):
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title

def get_default_category():
    # Assuming the default tutor is the first tutor in the database
    return Category.objects.first()

# A model that represents the possible subjects a tutor teaches
class Subject(models.Model):
    title = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subjects", default = get_default_category)

    def __str__(self):
        return self.title
