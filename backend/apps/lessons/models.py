from django.db import models
from django.contrib.auth.models import User
# from backend.apps.uploads.models import UploadRecord - This will be revised and corrected
from django.core.exceptions import ValidationError


class Assignment(models.Model):  # Assignments: Represents assignments given to individual students.
    ASSIGNMENT_TYPES = [
        ('EX', 'Exercises'),
        ('HW', 'Homework'),
        ('QZ', 'Quiz'),
        ('TT', 'Tests')
        # Can add more if needed...
    ]
    # Fields
    title = models.CharField(max_length=200)
    description = models.TextField()
    assignment_type = models.CharField(max_length=2, choices=ASSIGNMENT_TYPES)

    # Upload_record (ForeignKey to UploadRecord) - Currently not referenced correctly but will be when branch is updated
    # upload_record = models.ForeignKey(UploadRecord, on_delete=models.SET_NULL, null=True, blank=True)

    # Student (ForeignKey to User as there's no model exclusively for student)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="student", null=True, blank=True)
    # ^ Currently student is temporarily allowed to be nullable. Can be manually updated in a later time.

    deadline = models.DateTimeField()

    def __str__(self):
        return self.title


class Quiz(models.Model):  # Quizzes: Represents quizzes linked to assignments.
    # Fields
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    time_limit = models.PositiveIntegerField(help_text="Time limit for the quiz (in minutes)")
    num_of_questions = models.PositiveIntegerField()
    attempts = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Quiz for {self.assignment.title}"


class Question(models.Model):  # Questions: Represents individual questions within a quiz.
    QUESTION_TYPES = [
        ('MC', 'Multiple Choice'),
        ('SA', 'Short Answer'),
    ]
    # Fields
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question_type = models.CharField(max_length=2, choices=QUESTION_TYPES)
    order_of_question = models.PositiveIntegerField()
    question_text = models.TextField()
    # New field to store points/score for the question
    points = models.PositiveIntegerField(default=1, help_text="Points assigned to this question")

    def __str__(self):
        quiz_title = self.quiz.assignment.title if self.quiz and self.quiz.assignment else "Unknown Quiz"
        return f"Question {self.order_of_question} - {quiz_title}"


class Choice(models.Model):  # Choices: Store the possible answer choices for multiple choice questions.
    # Fields
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="choices")
    choice_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Choice: {self.choice_text} ({'Correct' if self.is_correct else 'Incorrect'})"


class Solution(models.Model):  # Solutions: Represents correct answers to questions.
    # Fields
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choices = models.ManyToManyField(Choice, blank=True)  # for multiple choice questions
    short_answer_text = models.TextField(blank=True, null=True)  # for short answer questions
    
    # New validation that ensures MC questions have at least one correct answer
    def clean(self):
        if self.question.question_type == 'MC' and not self.choices.filter(is_correct=True).exists():
            raise ValidationError("A multiple-choice question must have at least one correct answer.")

    def __str__(self):
        if self.question.question_type == 'MC':
            correct_choices = ", ".join(choice.choice_text for choice in self.choices.all())
            return f"Solution for Question {self.question.id}: {correct_choices}"
        elif self.question.question_type == 'SA':
            return f"Solution for Question {self.question.id}: {self.short_answer_text[:30]}"
        else:
            return f"Solution for Question {self.question.id}: (No Answer Set)"
