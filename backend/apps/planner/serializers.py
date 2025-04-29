from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
from .models import CalendarEvent

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = '__all__'

    def validate(self, data):
        instance = CalendarEvent(**data)
        try:
            instance.clean()
        except DjangoValidationError as e:
            raise DRFValidationError(e.messages)
        return data