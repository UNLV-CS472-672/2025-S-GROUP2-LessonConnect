from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .permissions import IsAdminOrTutor
from .models import Assignment, Quiz, Question, Choice, Solution
from .serializers import AssignmentSerializer, QuizSerializer, QuestionSerializer, ChoiceSerializer, SolutionSerializer


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

    # (PUT) Update an assignment (Admin/Tutor only)
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


# - Quiz:
class QuizListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    # Fetch/get all quizzes
    def get(self, request, assignment_id):
        quizzes = Quiz.objects.filter(assignment__id=assignment_id)
        serializer = QuizSerializer(quizzes, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    # Create a Quiz (Admin/Tutor only)
    def post(self, request, assignment_id):
        """
        # Check that user is an admin or a tutor
        self.check_permissions(request)
        if not IsAdminOrTutor().has_permission(request, self):
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
        """
        data = request.data.copy()
        data['assignment'] = assignment_id
        serializer = QuizSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuizDetailView(APIView):
    permission_classes = [IsAuthenticated]

    # Helper method to check if object is found or not
    def get_object(self, assignment_id, quiz_id):
        return get_object_or_404(Quiz, pk=quiz_id, assignment__id=assignment_id)

    # Get (specific) quiz details
    def get(self, request, assignment_id, quiz_id):
        quiz = self.get_object(assignment_id, quiz_id)
        serializer = QuizSerializer(quiz)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    # Update a quiz (Admin/Tutor only)
    def patch(self, request, assignment_id, quiz_id):
        # Check that user is an admin or a tutor
        self.check_permissions(request)
        if not IsAdminOrTutor().has_permission(request, self):
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

        quiz = self.get_object(assignment_id, quiz_id)
        serializer = QuizSerializer(quiz, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete quiz (Admin/Tutor only)
    def delete(self, request, assignment_id, quiz_id):
        # Check that user is an admin or a tutor
        self.check_permissions(request)
        if not IsAdminOrTutor().has_permission(request, self):
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

        quiz = self.get_object(assignment_id, quiz_id)
        quiz.delete()
        return Response({"status": "success", "message": "Quiz deleted"}, status=status.HTTP_200_OK)
# --------------


# - Quizzes and Questions:
class QQuestionListView(APIView):
    permission_classes = [IsAuthenticated]

    # Fetch/get all questions for a quiz
    def get(self, request, assignment_id, quiz_id):
        quiz = Quiz.get_quiz(quiz_id)

        if not quiz:
            return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

        questions = Question.objects.filter(quiz=quiz)
        serializer = QuestionSerializer(questions, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


class QuestionCreateView(APIView):
    permission_classes = [IsAdminOrTutor]

    # Add question (Admin/Tutor only)
    def post(self, request, assignment_id, quiz_id):
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
    def put(self, request, assignment_id, quiz_id, question_id):
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
    def delete(self, request, assignment_id, quiz_id, question_id):
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
    def get(self, request, assignment_id, quiz_id, question_id):
        question = Question.get_question(question_id)

        if not question:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        choices = Choice.get_choices(question)
        serializer = ChoiceSerializer(choices, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


class ChoiceCreateView(APIView):
    permission_classes = [IsAdminOrTutor]

    # Add multiple choices at once (Admin/Tutor only)
    def post(self, request, assignment_id, quiz_id, question_id):
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
    def put(self, request, assignment_id, quiz_id, question_id):
        # maybe convert to patch? Where serializer partial=true.
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
    def delete(self, request, assignment_id, quiz_id, question_id):
        question = Question.get_question(question_id)

        if not question:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        Choice.delete_choices(question)
        return Response({"status": "success", "message": "All choices deleted"}, status=status.HTTP_200_OK)
# --------------


# - Solutions:
class SolutionDetailView(APIView):
    permission_classes = [IsAdminOrTutor]

    # Helper method to check if object is found or not
    def get_object(self, question_id):
        try:
            # Assumes each question has one solution
            return Solution.objects.get(question__id=question_id)
        except Solution.DoesNotExist:
            return None

    # Retrieve a solution for a given question (Admin/Tutor only)
    def get(self, request, assignment_id, quiz_id, question_id):
        solution = self.get_object(question_id)
        if not solution:
            return Response({"error": "Solution not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = SolutionSerializer(solution)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


class SolutionCreateView(APIView):
    permission_classes = [IsAdminOrTutor]

    # Create a Solution for a given question (Admin/Tutor only)
    def post(self, request, assignment_id, quiz_id, question_id):
        question = Question.get_question(question_id)
        if not question:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data["question"] = question_id  # Associate the solution with the question

        serializer = SolutionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SolutionUpdateView(APIView):
    permission_classes = [IsAdminOrTutor]

    # Update the Solution for a given question (Admin/Tutor only)
    def put(self, request, assignment_id, quiz_id, question_id):
        try:
            solution = Solution.objects.get(question__id=question_id)
        except Solution.DoesNotExist:
            return Response({"error": "Solution not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = SolutionSerializer(solution, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SolutionDeleteView(APIView):
    permission_classes = [IsAdminOrTutor]

    # Delete the solution for a given question (Admin/Tutor only)
    def delete(self, request, assignment_id, quiz_id, question_id):
        try:
            solution = Solution.objects.get(question__id=question_id)
        except Solution.DoesNotExist:
            return Response({"error": "Solution not found"}, status=status.HTTP_404_NOT_FOUND)

        solution.delete()
        return Response({"status": "success", "message": "Solution deleted"}, status=status.HTTP_200_OK)
