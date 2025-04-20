from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
from .models import Booking, Review, Availability
from .serializers import BookingSerializer, ReviewSerializer, AvailabilitySerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = []  # Restrict access to authenticated users

    def perform_create(self, serializer):
        """Ensure the student is the one making the booking."""
        serializer.save(student=self.request.user)  # Automatically set the student'

    def get_queryset(self):
        user = self.request.user
        # if user.is_staff:
        return Booking.objects.all()
        # elif user.is_anonymous:
        #     return Booking.objects.none()
        # return Booking.objects.filter(student=user) | Booking.objects.filter(tutor=user)

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

@api_view(['GET'])
def get_availability_by_tutor_and_date(request):
    tutor_id = request.GET.get('tutor_id')
    selected_date = request.GET.get('date')  # format: YYYY-MM-DD

    if not tutor_id or not selected_date:
        return Response({"error": "Missing tutor_id or date parameter."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        date_obj = datetime.strptime(selected_date, "%Y-%m-%d").date()
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

    start_of_day = datetime.combine(date_obj, datetime.min.time())
    end_of_day = datetime.combine(date_obj, datetime.max.time())

    availabilities = Availability.objects.filter(
        tutor__id=tutor_id,
        start_time__gte=start_of_day,
        end_time__lte=end_of_day,
        is_booked=False
    )

    # For debug purposes
    # availabilities = Availability.objects.all()

    serializer = AvailabilitySerializer(availabilities, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_booking(request):
    student_id = request.data.get('student_id')
    availability_id = request.data.get('availability_id')
    description = request.data.get('description', '')
    session_price = request.data.get('session_price')

    if not all([student_id, availability_id, session_price]):
        return Response({'error': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        student = User.objects.get(id=student_id)
        availability = Availability.objects.get(id=availability_id, is_booked=False)
    except User.DoesNotExist:
        return Response({'error': 'Student not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Availability.DoesNotExist:
        return Response({'error': 'Availability not found or already booked.'}, status=status.HTTP_404_NOT_FOUND)

    booking = Booking.objects.create(
        student=student,
        availability=availability,
        description=description,
        session_price=session_price
    )

    availability.is_booked = True
    availability.save()

    return Response({
        'message': 'Booking created successfully.',
        'booking_id': booking.payment_gateway_ref
    }, status=status.HTTP_201_CREATED)