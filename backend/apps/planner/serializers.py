from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
from .models import CalendarEvent, UnscheduledTask

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


class UnscheduledTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnscheduledTask
        fields = [
            'id',
            'title',
            'description',
            'due_date',
            'assigned_assignment',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
