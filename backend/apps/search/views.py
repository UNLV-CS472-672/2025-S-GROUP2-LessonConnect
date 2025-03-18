from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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
        what = self.request.query_params.get('what', "")  # Search term (Tutor name, Subject, Category)
        where = self.request.query_params.get('where', "")  # City, State (Assumes user insert both)

        if what == "" or where == "": #what and where should be required input
            search_results = TutorProfile.objects.none()
            return Response({"message": "No results found"}, status=status.HTTP_204_NO_CONTENT)

        #Parse the where query
        city, state = TutorProfile.objects.parse_where_query(where)
        filtered_tutors = TutorProfile.objects.filter_tutors_by_location(what, city, state)
        search_results = TutorProfile.objects.search(filtered_tutors, what)

        # Done to help match partial words that django-watson might overlook
        # When searching for subject/category
        search_terms = re.split(r'[\W\s]+', what)
        query = Q()

        for term in search_terms:
            query = Q(category__title__icontains=term) | Q(title__icontains=term)

        subject_query = Subject.objects.filter(query)

        if subject_query:
            filtered_tutors = TutorProfile.objects.filter_tutors_by_subject(filtered_tutors, subject_query)
            search_results = (filtered_tutors | search_results).distinct()

        result_data = TutorProfile.objects.get_result_data(search_results)
        serializer = TutorSearchResultSerializer(result_data, many=True)

        return Response({'status': 'success', 'data': serializer.data}, status=status.HTTP_200_OK)