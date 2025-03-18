from django.db import models
from watson import search

class TutorProfileManager(models.Manager):

    def create_tutor_profile(self, profile, city, state, bio="", hourly_rate=0.0):
        # Create a new TutorProfile instance with the provided data
        tutor_profile = self.model(
            profile=profile,
            city=city,
            state=state,
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
        # Prefetch related subjects to optimize database queries
        filtered_tutors = filtered_tutors.prefetch_related('subjects')
        # Filter tutors who have any of the subjects in the subject_query
        filtered_tutors = filtered_tutors.filter(subjects__in=subject_query)
        return filtered_tutors

    def search(self, filtered_tutors, what):
        # Use Watson to filter the tutors based on the 'what' search term
        search_results = search.filter(filtered_tutors, what)
        return search_results

    def get_result_data(self, search_results):
        # Use select_related to reduce queries and retrieve only the required fields
        search_results = search_results.select_related('profile__user').only(
            'profile__user__first_name',
            'profile__user__last_name',
            'bio',
            'hourly_rate',
            'state',
            'city'
        )
        return search_results

    # Method to parse the 'where' query and extract city and state
    def parse_where_query(self, where):
        city, state = where.split(",")
        city = city.strip()  # Removes any leading/trailing whitespace
        state = state.strip()
        return city, state
