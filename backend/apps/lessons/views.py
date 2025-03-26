from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .permissions import IsAdminOrTutor
from .models import Assignment, Quiz, Question, Choice
from .serializers import AssignmentSerializer, QuizSerializer, QuestionSerializer, ChoiceSerializer


# - Assignments:
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
# --------------


# - Quizzes and Questions:
# No endpoints that serialize or modify quiz objects. The QuizSerializer was added for potential future use
# examples being: Fetching quiz or creating quiz or updating quiz
class QuizQuestionListView(APIView):
    permission_classes = [IsAuthenticated]

    # Fetch/get all questions for a quiz
    def get(self, request, quiz_id):
        quiz = Quiz.get_quiz(quiz_id)

        if not quiz:
            return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

        questions = Question.objects.filter(quiz=quiz)
        serializer = QuestionSerializer(questions, many=True)  # QuizSerializer not needed here?
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
# --------------


# - Choices:
class ChoiceListView(APIView):
    permission_classes = [IsAuthenticated]

    # List choices for a question
    def get(self, request, question_id):
        question = Question.get_question(question_id)

        if not question:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        choices = Choice.get_choices(question)
        serializer = ChoiceSerializer(choices, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


class ChoiceCreateView(APIView):
    permission_classes = [IsAdminOrTutor]

    # Add multiple choices at once (Admin/Tutor only)
    def post(self, request, question_id):
        question = Question.get_question(question_id)

        if not question:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        choices_data = request.data.get("choices", [])

        if not choices_data:
            return Response({"error": "No choices provided"}, status=status.HTTP_400_BAD_REQUEST)

        created_choices = Choice.bulk_create_choices(choices_data, question)
        serializer = ChoiceSerializer(created_choices, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)


class ChoiceUpdateView(APIView):
    permission_classes = [IsAdminOrTutor]

    # Bulk update choices (Admin/Tutor only)
    def put(self, request, question_id):    # maybe convert to patch? Where serializer partial=true.
        question = Question.get_question(question_id)

        if not question:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        choices_data = request.data.get("choices", [])

        if not choices_data:
            return Response({"error": "No choices provided"}, status=status.HTTP_400_BAD_REQUEST)

        Choice.bulk_update_choices(choices_data, question)
        updated_choices = Choice.get_choices(question)
        serializer = ChoiceSerializer(updated_choices, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


class ChoiceDeleteView(APIView):
    permission_classes = [IsAdminOrTutor]

    # Delete all choices for a question (Admin/Tutor only)
    def delete(self, request, question_id):
        question = Question.get_question(question_id)

        if not question:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        Choice.delete_choices(question)
        return Response({"status": "success", "message": "All choices deleted"}, status=status.HTTP_200_OK)