from rest_framework import viewsets
from .models import Booking
from .serializers import BookingSerializer
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