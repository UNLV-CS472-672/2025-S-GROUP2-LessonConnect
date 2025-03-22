from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Booking, Review
from .serializers import BookingSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticated


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = []  # Restrict access to authenticated users

    def perform_create(self, serializer):
        """Ensure the student is the one making the booking."""
        serializer.save(student=self.request.user)  # Automatically set the student'

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(student=user) | Booking.objects.filter(tutor=user)

# GET /api/reviews/ - Get all reviews
@api_view(['GET'])
def get_reviews(request):
    reviews = Review.objects.filter(is_visible=True)  # Only show visible reviews
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


# POST /api/reviews/ - Submit a new review
@api_view(['POST'])
def submit_review(request):
    # Check if the required data exists in the request
    if 'tutor' not in request.data or 'rating' not in request.data or 'feedback' not in request.data:
        return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

    serializer = ReviewSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(reviewer=request.user)  # Associate the logged-in user as the student
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
