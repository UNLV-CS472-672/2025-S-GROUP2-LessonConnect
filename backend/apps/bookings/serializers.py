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

        # tutor = models.ForeignKey(User, on_delete=models.CASCADE)
        # reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
        # rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
        # feedback = models.TextField(null=True, blank=True)
        # created_at = models.DateTimeField(auto_now_add=True)
        #
        # is_visible = models.BooleanField(default=True)  # Whether the review is visible to others
        # is_moderated = models.BooleanField(
        #     default=False)  # Whether the review has been moderated (e.g., checked for inappropriate content)

