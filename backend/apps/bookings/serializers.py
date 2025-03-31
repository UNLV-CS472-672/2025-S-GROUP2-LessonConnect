from rest_framework import serializers
from .models import Booking, Review


class BookingSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.username', read_only=True)
    tutor_username = serializers.CharField(source='tutor.username', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'


class BookingDetailSerializer(BookingSerializer):
    class Meta(BookingSerializer.Meta):
        fields = BookingSerializer.Meta.fields
        extra_kwargs = {
            'booking': {'read_only': True}
        }

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['tutor', 'reviewer', 'rating', 'feedback', 'created_at', 'is_visible', 'is_moderated']
        read_only_fields = ['created_at', 'is_visible', 'is_moderated']
