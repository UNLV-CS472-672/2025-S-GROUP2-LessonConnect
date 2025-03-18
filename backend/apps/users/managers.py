from django.db import models
from watson import search

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

    def filter_tutors_by_location(self, what, city, state):
        # Filter tutor profiles based on city and state
        filtered_tutors = self.filter(city=city, state=state)
        return filtered_tutors

    def filter_tutors_by_subject(self, filtered_tutors, subject_query):
        filtered_tutors = filtered_tutors.filter(subjects__in=subject_query)

        filtered_tutors = filtered_tutors.prefetch_related('subjects')

        return filtered_tutors

    def search(self, filtered_tutors, what):
        # Apply search filtering
        search_results = search.filter(filtered_tutors, what)
        return search_results

    def get_result_data(self, search_results):
        # Optimize query with select_related and only required fields
        search_results = search_results.select_related('profile__user').only(
            'profile__user__first_name',
            'profile__user__last_name',
            'bio',
            'hourly_rate',
            'state',
            'city'
        )
        return search_results

    def parse_where_query(self, where):
        city, state = where.split(",")
        city = city.strip()  # Removes any leading/trailing whitespace
        state = state.strip()
        return city, state
