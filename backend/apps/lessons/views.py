from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .permissions import IsAdminOrTutor
from .models import Assignment, Quiz, Question
from .serializers import AssignmentSerializer, QuizSerializer, QuestionSerializer


class AssignmentDetailView(APIView):
    # Only authenticated users can access - ensures user is logged in & authenticated
    permission_classes = [IsAuthenticated]

    # Get assignment details
    def get(self, request, pk):
        # pk stands for Primary Key - just a unique id
        assignment = Assignment.get_assignment(pk)

        if not assignment:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssignmentSerializer(assignment)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    # Delete assignment (Admin/Tutor only)
    def delete(self, request, pk):
        assignment = Assignment.get_assignment(pk)

        if not assignment:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

        assignment.delete_assignment()
        return Response({"status": "success", "message": "Assignment deleted"}, status=status.HTTP_200_OK)

    # Update an assignment (Admin/Tutor only)
    def patch(self, request, pk):
        assignment = Assignment.get_assignment(pk)

        if not assignment:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssignmentSerializer(assignment, data=request.data, partial=True)

        if serializer.is_valid():
            assignment.update_assignment(serializer.validated_data)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssignmentCreateView(APIView):
    permission_classes = [IsAdminOrTutor]  # Only Admin and Tutor allowed

    # Create an assignment (Admin/Tutor only)
    def post(self, request):
        serializer = AssignmentSerializer(data=request.data)

        # Check that created assignment serializer was created
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# ------------


class QuizQuestionListView(APIView):
    permission_classes = [IsAuthenticated]

    # Fetch/get all questions for a quiz
    def get(self, request, quiz_id):
        quiz = Quiz.get_quiz(quiz_id)

        if not quiz:
            return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

        questions = Question.objects.filter(quiz=quiz)
        serializer = QuestionSerializer(questions, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


class QuestionCreateView(APIView):
    permission_classes = [IsAdminOrTutor]

    # Add question (Admin/Tutor only)
    def post(self, request, quiz_id):
        quiz = Quiz.get_quiz(quiz_id)

        if not quiz:
            return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        data["quiz"] = quiz.id  # Associate question with the quiz
        serializer = QuestionSerializer(data=data)

        # Check that created Question serializer was created
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuestionUpdateView(APIView):
    permission_classes = [IsAdminOrTutor]

    # Update (an existing) question (Admin/Tutor only)
    def put(self, request, quiz_id, question_id):
        # question_id required!
        question = Question.get_question(question_id)

        if not question:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = QuestionSerializer(question, data=request.data, partial=True)

        if serializer.is_valid():
            question.update_question(serializer.validated_data)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuestionDeleteView(APIView):
    permission_classes = [IsAdminOrTutor]

    # Delete a question (Admin/Tutor only)
    def delete(self, request, quiz_id, question_id):
        question = Question.get_question(question_id)

        if not question:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        question.delete_question()
        return Response({"status": "success", "message": "Question deleted"}, status=status.HTTP_200_OK)
# ------------
