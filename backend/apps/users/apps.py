from django.apps import AppConfig
from watson import search

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'

    # https://idiomaticprogrammers.com/post/django-watson-full-text-search-guide/
    # Register the search with django-watson
    def ready(self):
        tutor_profile_model = self.get_model("TutorProfile")
        search.register(tutor_profile_model,
            fields=[
            "profile__user__first_name", "profile__user__last_name"
        ])
