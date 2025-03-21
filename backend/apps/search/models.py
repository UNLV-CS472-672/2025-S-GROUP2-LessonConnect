from django.db import models

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



