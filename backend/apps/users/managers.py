from django.db import models
from watson import search
from django.db.models import Prefetch
from apps.search.models import Subject

class ProfileManager(models.Manager):

    def create(self, user, role):
        # Create a new Profile instance with the provided data
        profile = self.model(
            user=user,
            role=int(role)
        )
        profile.save() # Save the instance to the database
        return profile

class TutorProfileManager(models.Manager):

    def create(self, profile, city, state, bio="", hourly_rate=0.0):
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

    def filter_tutors_by_location(self, city, state):
        # Filter tutor profiles based on city and state
        filtered_tutors = self.filter(city=city, state=state)
        return filtered_tutors

    # Method to parse the 'where' query and extract city and state
    def parse_where_query(self, where):
        city, state = where.split(",")
        city = city.strip()  # Removes any leading/trailing whitespace
        state = state.strip()
        return city, state

    def filter_tutors_by_rating(self, filtered_tutors, rating):
        # Filter tutor profiles based on rating
        filtered_tutors = filtered_tutors.filter(rating__gte=rating)
        return filtered_tutors

    def filter_by_price_range(self, filtered_tutors, min_price=None, max_price=None):
        # Filter the tutor profiles based on price range
        if min_price is not None:
            filtered_tutors = filtered_tutors.filter(hourly_rate__gte=min_price)
        if max_price is not None:
            filtered_tutors= filtered_tutors.filter(hourly_rate__lte=max_price)
        return filtered_tutors

    def filter_tutors_by_subject(self, filtered_tutors, subject_query, is_subjects_filtered):
        # If matching subjects are found, filter tutors by these subjects
        if not subject_query.exists():
            return self.none()

        # Checks if the subjects have already been filtered to
        # avoid doing an extra prefetch
        if is_subjects_filtered:
            # Filter tutors who have any of the subjects in the subject_query
            filtered_tutors = filtered_tutors.filter(subjects__in=subject_query)
        else:
            # Prefetch related subjects to optimize database queries (prefetch only needs to occur once)
            filtered_tutors = filtered_tutors.prefetch_related('subjects')
            # Filter tutors who have any of the subjects in the subject_query
            filtered_tutors = filtered_tutors.filter(subjects__in=subject_query)

        return filtered_tutors

    def search(self, filtered_tutors, what):
        # Use Watson to filter the tutors (using stemming) based on the 'what' search term
        search_results = search.filter(filtered_tutors, what)
        return search_results

    def get_result_data(self, search_results):
        # Use select_related to reduce queries and retrieve only the required fields
        search_results = search_results.select_related('profile__user', 'profile').prefetch_related(
            Prefetch('subjects', queryset=Subject.objects.only('title'))
        ).only(
            'profile__user__first_name',
            'profile__user__last_name',
            'bio',
            'hourly_rate',
            'state',
            'city',
            'profile__profile_picture__upload' #changed
        )
        return search_results