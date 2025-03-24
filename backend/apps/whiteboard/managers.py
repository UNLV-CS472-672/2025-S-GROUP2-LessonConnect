from django.db import models

# https://testdriven.io/blog/django-channels/ (reference)
class BoardManager(models.Manager):

    def connect_user(self, user):
        self.participants.add(user)
        self.save()

    def disconnect_user(self, user):
        self.participants.remove(user)
        self.save()