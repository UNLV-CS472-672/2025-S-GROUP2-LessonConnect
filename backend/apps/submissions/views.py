from rest_framework import viewsets, status
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.apps import apps
from django.conf import settings
from .models import Submissions, FileSubmissions, QuizSubmissions, StudentQuizAnswers
from .serializers import (
    SubmissionsSerializer,
    FileSubmissionsSerializer,
    QuizSubmissionsSerializer,
    StudentQuizAnswersSerializer
)

class SubmissionsViewSet(viewsets.ModelViewSet):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionsSerializer
    
    # Bypass permissions for testing (debugging)
    permission_classes = []  # Debug only: No authentication required

    @action(detail=True, methods=['post'])
    def grade_submission(self, request, pk=None):
        """Custom action to grade a submission"""
        submission = get_object_or_404(Submissions, pk=pk)
        score = request.data.get('score')

        if score is None:
            return Response({"error": "Score is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            score = float(score)
            if score < 0:
                return Response({"error": "Score cannot be negative"}, status=status.HTTP_400_BAD_REQUEST)
            submission.score = score
            submission.graded_at = timezone.now()
            submission.save()
            return Response(SubmissionsSerializer(submission).data)
        except ValueError:
            return Response({"error": "Invalid score format"}, status=status.HTTP_400_BAD_REQUEST)

    # If you need a user for testing purposes (hardcoding)
    def create(self, request, *args, **kwargs):
        """Override create method for testing with hardcoded user"""
        # Debug: Get the user model class
        User = apps.get_model(settings.AUTH_USER_MODEL)
        user = User.objects.first()
        request.data["user"] = user.id  

        return super().create(request, *args, **kwargs)

class FileSubmissionsViewSet(viewsets.ModelViewSet):
    queryset = FileSubmissions.objects.all()
    serializer_class = FileSubmissionsSerializer

class QuizSubmissionsViewSet(viewsets.ModelViewSet):
    queryset = QuizSubmissions.objects.all()
    serializer_class = QuizSubmissionsSerializer

class StudentQuizAnswersViewSet(viewsets.ModelViewSet):
    queryset = StudentQuizAnswers.objects.all()
    serializer_class = StudentQuizAnswersSerializer
