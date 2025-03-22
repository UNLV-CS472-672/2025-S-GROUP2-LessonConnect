from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Submissions, QuizSubmissions, StudentQuizAnswers
from .serializers import SubmissionSerializer, FileSubmissionSerializer, QuizSubmissionSerializer, StudentQuizAnswerSerializer
from .managers import SubmissionManager, FileSubmissionManager, QuizSubmissionManager

# Use the custom managers to handle business logic
submission_manager = SubmissionManager()
file_submission_manager = FileSubmissionManager()
quiz_submission_manager = QuizSubmissionManager()

class CreateSubmissionView(APIView):
    def post(self, request):
        serializer = SubmissionSerializer(data=request.data)
        if serializer.is_valid():
            student_profile = request.data.get('student_profile')
            submission = submission_manager.create_submission(student_profile)
            return Response(SubmissionSerializer(submission).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubmissionDetailView(generics.RetrieveAPIView):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionSerializer


class ListSubmissionsView(generics.ListAPIView):
    queryset = Submissions.objects.all()
    serializer_class = SubmissionSerializer


class UpdateSubmissionStatusView(APIView):
    def patch(self, request, submission_id):
        status = request.data.get('submission_status')
        submission = submission_manager.update_submission_status(submission_id, status)
        return Response(SubmissionSerializer(submission).data, status=status.HTTP_200_OK)


class CreateQuizSubmissionView(APIView):
    def post(self, request):
        submission = Submissions.objects.get(id=request.data.get('submission_id'))
        quiz_submission = quiz_submission_manager.create_quiz_submission(submission)
        return Response(QuizSubmissionSerializer(quiz_submission).data, status=status.HTTP_201_CREATED)


class SaveQuizAnswerView(APIView):
    def post(self, request, submission_id):
        quiz_submission = QuizSubmissions.objects.get(submission_id=submission_id)
        student_response = request.data.get('student_response')
        is_correct = request.data.get('is_correct')
        answer = quiz_submission_manager.save_quiz_answer(quiz_submission, student_response, is_correct)
        return Response(StudentQuizAnswerSerializer(answer).data, status=status.HTTP_201_CREATED)


class SubmitQuizView(APIView):
    def post(self, request, submission_id):
        quiz_submission = QuizSubmissions.objects.get(submission_id=submission_id)
        submission = quiz_submission_manager.mark_quiz_as_submitted(quiz_submission)
        return Response(SubmissionSerializer(submission).data, status=status.HTTP_200_OK)


class GetQuizAnswersView(generics.ListAPIView):
    def get(self, request, submission_id):
        answers = quiz_submission_manager.get_quiz_answers(submission_id)
        return Response(StudentQuizAnswerSerializer(answers, many=True).data, status=status.HTTP_200_OK)

