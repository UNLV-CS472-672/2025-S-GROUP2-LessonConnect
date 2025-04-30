from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Achievement, StudentAchievement
from .serializers import (
    AchievementSerializer,
    StudentAchievementSerializer,
    StudentAchievementUpdateSerializer,
)
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

class StudentAchievementViewSet(viewsets.ModelViewSet):
    queryset = StudentAchievement.objects.all()
    serializer_class = StudentAchievementSerializer

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=False, methods=['get'], url_path='by-student/(?P<student_id>[^/.]+)', name='studentachievement-by-student')
    def by_student(self, request, student_id=None):
        achievements = self.queryset.filter(student__id=student_id)
        serializer = self.get_serializer(achievements, many=True)
        return Response(serializer.data)

class AchievementListAPIView(generics.ListAPIView):
    queryset = Achievement.objects.all().order_by('created_at')
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]

class StudentAchievementCreateAPIView(generics.CreateAPIView):
    queryset = StudentAchievement.objects.all()
    serializer_class = StudentAchievementSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class StudentAchievementsByStudentAPIView(generics.ListAPIView):
    serializer_class = StudentAchievementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        student_id = self.kwargs["student_id"]
        return StudentAchievement.objects.filter(student_id=student_id).select_related('achievement')

class StudentAchievementUpdateAPIView(generics.UpdateAPIView):
    queryset = StudentAchievement.objects.all()
    serializer_class = StudentAchievementUpdateSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
