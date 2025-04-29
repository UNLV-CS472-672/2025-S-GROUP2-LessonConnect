from rest_framework import serializers


from .models import CalendarEvent, UnscheduledTask

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = '__all__'








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