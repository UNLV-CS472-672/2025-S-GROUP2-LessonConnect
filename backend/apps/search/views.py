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

        # Filter tutors by location
        filtered_tutors = TutorProfile.objects.filter_tutors_by_location(what, city, state)
        # Perform search with 'what' term
        search_results = TutorProfile.objects.search(filtered_tutors, what)

        # Split the 'what' search term into individual words, handling non-word characters and spaces
        # This helps match partial words that django-watson might overlook
        search_terms = re.split(r'[\W\s]+', what)
        query = Q()

        # Loop through each search term and create a query that checks if the term is
        # in the category title or the subject title
        for term in search_terms:
            query |= Q(category__title__icontains=term) | Q(title__icontains=term)

        try:
            # Attempt to filter subjects based on the search query
            subject_query = Subject.objects.filter(query)
            # If matching subjects are found, filter tutors by these subjects
            if subject_query.exists():
                filtered_tutors = TutorProfile.objects.filter_tutors_by_subject(filtered_tutors, subject_query)
                # Combine the filtered tutors with the existing search results
                search_results = (filtered_tutors | search_results).distinct()
        except Exception as e:
            return Response({"message": f"Error searching subjects: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Process the results and serialize
        result_data = TutorProfile.objects.get_result_data(search_results)
        serializer = TutorSearchResultSerializer(result_data, many=True)

        return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)