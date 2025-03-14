from django.db import models

class TutorProfileManager(models.Manager):
    def create_tutor_profile(self, profile, location, bio="", hourly_rate=0.0):
        # Create a new TutorProfile instance with the provided data
        tutor_profile = self.model(
            profile=profile,
            location=location,
            bio=bio,
            hourly_rate=hourly_rate
        )

        tutor_profile.save() # Save the instance to the database
        return tutor_profile
