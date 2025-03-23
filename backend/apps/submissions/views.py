from rest_framework import viewsets
from rest_framework.permissions import AllowAny  # Allow all users (bypass authentication)
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
    permission_classes = [AllowAny]
    def perform_create(self, serializer):
        serializer.save()
    #  def get_queryset(self):

class FileSubmissionsViewSet(viewsets.ModelViewSet):
    queryset = FileSubmissions.objects.all()
    serializer_class = FileSubmissionsSerializer
    permission_classes = [AllowAny] 

class QuizSubmissionsViewSet(viewsets.ModelViewSet):
    queryset = QuizSubmissions.objects.all()
    serializer_class = QuizSubmissionsSerializer
    permission_classes = [AllowAny]  

class StudentQuizAnswersViewSet(viewsets.ModelViewSet):
    queryset = StudentQuizAnswers.objects.all()
    serializer_class = StudentQuizAnswersSerializer
    permission_classes = [AllowAny]  
