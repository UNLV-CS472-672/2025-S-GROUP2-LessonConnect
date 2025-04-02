from rest_framework import serializers
from .models import Submissions, FileSubmissions, QuizSubmissions, StudentQuizAnswers


class SubmissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submissions
        fields = '__all__'

    def validate_score(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Score cannot be negative.")
        return value

class QuizSubmissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizSubmissions
        fields = '__all__'

class StudentQuizAnswersSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentQuizAnswers
        fields = '__all__'

class FileSubmissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileSubmissions
        fields = '__all__'
