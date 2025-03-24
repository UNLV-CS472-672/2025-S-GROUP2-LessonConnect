from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
import re
from .models import Subject, Category
from apps.users.models import TutorProfile
from apps.users.managers import TutorProfileManager
from .serializers import TutorSearchResultSerializer

# Create your views here.
class SearchView(APIView):
    permission_classes = []  # Debug only: No authentication required
    def get(self, request, format=None):
        # Extracts the what and where parameters from the request URL
        # (ex: search/?what=John&where=New%20York%2C%20NY)
        what = self.request.query_params.get('what', "").strip()  # Search term (Tutor name, Subject, Category)
        where = self.request.query_params.get('where', "").strip()  # City, State (Assumes user enters both)

        # Check for empty 'what' or 'where' parameters
        if not what or not where:
            return Response({"message": "Both 'what' and 'where' parameters are required."}, status=status.HTTP_400_BAD_REQUEST)

        #Parse the where query
        try:
            # Parse the 'where' query into city and state
            city, state = TutorProfile.objects.parse_where_query(where)
        except Exception as e:
            return Response({"message": f"Error parsing location: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        # Apply all filters before searching with django-watson

        # Filter tutors by location (Required)
        filtered_tutors = TutorProfile.objects.filter_tutors_by_location(city, state)

        # Filter tutors by pay (Optional)
        min_price = request.query_params.get('min-price', "").strip()
        max_price = request.query_params.get('max-price', "").strip()

        try:
            # Convert from string to float
            min_price = float(min_price) if min_price else None
            max_price = float(max_price) if max_price else None

            # Check if max price is not less than min price
            if min_price is not None and max_price is not None and max_price < min_price:
                return Response({"message": "Max price cannot be less than min price."}, status=status.HTTP_400_BAD_REQUEST)

            # Filter based of price range
            filtered_tutors = TutorProfile.objects.filter_by_price_range(filtered_tutors, min_price, max_price)

        except ValueError:
            return Response({"message": "Price filters must be valid numbers."}, status=status.HTTP_400_BAD_REQUEST)


        # Filter tutors by rating (Optional)
        rating = request.query_params.get('rating', "").strip()
        if rating:
            try:
                # Convert from string to int
                rating = int(rating)
                # Filter based of rating (i.e. 4 stars and up, 3 stars and up, etc)
                filtered_tutors = TutorProfile.objects.filter_tutors_by_rating(filtered_tutors, rating)

            except ValueError:
                return Response({"message": "Invalid value for rating. It must be a number."}, status=status.HTTP_400_BAD_REQUEST)

        is_subjects_filtered = False
        query = Q()
        # Get subjects from request
        subjects = request.query_params.get('subjects', "").strip()
        # Filter tutors by subject (Optional)
        if subjects:
            subject_list = subjects.split(",")  # Assuming subjects are comma-separated
            # Execute the query for subjects
            query = Subject.objects.filter(Q(title__in=subject_list))
            filtered_tutors = TutorProfile.objects.filter_tutors_by_subject(filtered_tutors, query, is_subjects_filtered)
            is_subjects_filtered = True

        # Split the 'what' search term into individual words, handling non-word characters and spaces
        # This helps match partial words regarding subject and is used to pull up other
        # tutor results whose subjects fits this search term
        search_terms = re.split(r'[\W\s]+', what)
        lookup_subjects_query = Q()
        # This helps match partial names regarding tutors
        lookup_tutors_query = Q()

        # Loop through each search term and create a query that checks if the term is
        # in the category title or the subject title
        for term in search_terms:
            lookup_subjects_query |= Q(category__title__icontains=term) | Q(title__icontains=term)
            lookup_tutors_query |= Q(profile__user__first_name__icontains=term) | Q(profile__user__last_name__icontains=term)

        # Perform search with 'what' term
        search_results = TutorProfile.objects.search(filtered_tutors, what)
        # Combine with partial_tutor_matches
        partial_tutor_matches = TutorProfile.objects.filter(lookup_tutors_query)
        search_results = (search_results | partial_tutor_matches)

        try:
            # Execute the query for subjects
            subject_query = Subject.objects.filter(lookup_subjects_query)
            filtered_tutors = TutorProfile.objects.filter_tutors_by_subject(filtered_tutors, subject_query, is_subjects_filtered)
            # Combine the filtered tutors with the existing search results
            combined_results = (search_results_tagged | filtered_tutors_tagged).distinct()

        except Exception as e:
            return Response({"message": f"Error searching subjects: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Process the results and serialize
        result_data = TutorProfile.objects.get_result_data(combined_results) #og was search_results
        serializer = TutorSearchResultSerializer(result_data, many=True)

        return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)