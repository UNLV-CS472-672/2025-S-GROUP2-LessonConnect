from rest_framework import serializers
from .models import Assignment, Quiz, Question, Choice, Solution


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


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ["id", "assignment", "time_limit", "num_of_questions", "attempts", "is_active"]


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "quiz", "question_type", "order_of_question", "question_text", "points"]


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ["id", "question", "choice_text", "is_correct"]


class SolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solution
        fields = ["id", "question", "choices", "short_answer_text"]
