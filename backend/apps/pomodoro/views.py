from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PomodoroSession
from .serializers import PomodoroSessionSerializer

class StartPomodoroSession(APIView):
    def post(self, request, id):
        session = PomodoroSession.objects.filter(id=id).first()
        if not session:
            return Response({"error": "Pomodoro session not found"}, status=status.HTTP_404_NOT_FOUND)
            
        session.start()
        return Response({"message": "Pomodoro session started"}, status=status.HTTP_200_OK)

class PausePomodoroSession(APIView):
    def post(self, request, id):
        session = PomodoroSession.objects.get(id=id)
        session.pause()
        return Response({"message": "Pomodoro session paused"}, status=status.HTTP_200_OK)

class ResumePomodoroSession(APIView):
    def post(self, request, id):
        session = PomodoroSession.objects.get(id=id)
        session.resume()
        return Response({"message": "Pomodoro session resumed"}, status=status.HTTP_200_OK)

class CancelPomodoroSession(APIView):
    def post(self, request, id):
        session = PomodoroSession.objects.get(id=id)
        session.cancel()
        return Response({"message": "Pomodoro session canceled"}, status=status.HTTP_200_OK)

class CompletePomodoroSession(APIView):
    def post(self, request, id):
        session = PomodoroSession.objects.get(id=id)
        session.complete()
        return Response({"message": "Pomodoro session completed"}, status=status.HTTP_200_OK)

class GetPomodoroSessionStatus(APIView):
    def get(self, request, id):
        session = PomodoroSession.objects.get(id=id)
        serializer = PomodoroSessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetPomodoroSessionHistory(generics.ListAPIView):
    queryset = PomodoroSession.objects.all()
    serializer_class = PomodoroSessionSerializer
