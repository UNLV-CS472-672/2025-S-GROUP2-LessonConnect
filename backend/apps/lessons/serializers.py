from rest_framework import serializers
from .models import Assignment


class AssignmentSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Assignment
        fields = [
            "id",
            "title",
            "description",
            "assignment_type",
            "deadline",
            "student",
            "student_username",
            "upload_record",
            "upload_record_id"
        ]