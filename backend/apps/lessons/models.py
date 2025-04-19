from django.db import models
from django.contrib.auth.models import User
from apps.uploads.models import UploadRecord
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator


class Assignment(models.Model):  # Assignments: Represents assignments given to individual students.
    ASSIGNMENT_TYPES = [
        ('EX', 'Exercises'),
        ('HW', 'Homework'),
        ('QZ', 'Quiz'),
        ('TT', 'Tests'),
        # Can add more if needed...
        ('EC', 'Extra Credit')
    ]
    # Fields
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    assignment_type = models.CharField(max_length=2, choices=ASSIGNMENT_TYPES)

    # Upload_record (ForeignKey to UploadRecord)
    upload_record = models.ForeignKey(UploadRecord, on_delete=models.SET_NULL, null=True, blank=True)

    # Student (ForeignKey to User as there's no model exclusively for student)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assignments", null=True, blank=True)
    # ^ Currently student is temporarily allowed to be nullable. Can be manually updated in a later time.

    deadline = models.DateTimeField(null=True, blank=True)  # deadline is optional for extra credit/optional assignments

    def __str__(self):
        return self.title

    # Helper methods
    @classmethod
    def get_assignment(cls, assignment_id):
        try:
            return cls.objects.get(pk=assignment_id)
        except cls.DoesNotExist:
            return None

    def update_assignment(self, data):
        for field, value in data.items():
            setattr(self, field, value)
        self.save()
        return self

    def delete_assignment(self):
        self.delete()

class Quiz(models.Model):  # Quizzes: Represents quizzes linked to assignments.
    class Meta:
        verbose_name = 'Quiz'
        verbose_name_plural = 'Quizzes'
    # Fields
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    time_limit = models.PositiveIntegerField(null=True, blank=True, help_text="Time limit for the quiz (in minutes)")
    num_of_questions = models.PositiveIntegerField()
    attempts = models.IntegerField(validators=[MinValueValidator(1)])  # Ensures that at least 1 attempt is required
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.assignment.title}"

    # Helper Method
    @classmethod
    def get_quiz(cls, quiz_id):
        try:
            return cls.objects.get(pk=quiz_id)
        except cls.DoesNotExist:
            return None


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
    points = models.PositiveIntegerField(default=1, help_text="Points assigned to this question")

    def __str__(self):
        quiz_title = self.quiz.assignment.title if self.quiz and self.quiz.assignment else "Unknown Quiz"
        return f"{quiz_title} - Question {self.order_of_question}: {self.question_text} ({self.question_type})"

    # Helper Methods
    @classmethod
    def get_question(cls, question_id):
        try:
            return cls.objects.get(pk=question_id)
        except cls.DoesNotExist:
            return None

    def update_question(self, data):
        for field, value in data.items():
            setattr(self, field, value)
        self.save()
        return self

    def delete_question(self):
        self.delete()


class Choice(models.Model):  # Choices: Store the possible answer choices for multiple choice questions.
    # Fields
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="choices")
    choice_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        quiz_title = self.question.quiz.assignment.title if self.question.quiz and self.question.quiz.assignment else "Unknown Quiz"
        return f"{quiz_title} - Question {self.question.order_of_question}: Choice: \"{self.choice_text}\" ({'Correct' if self.is_correct else 'Incorrect'})"

    # Helper Methods
    @classmethod
    def get_choices(cls, question):
        return cls.objects.filter(question=question)

    @classmethod
    def delete_choices(cls, question):
        cls.objects.filter(question=question).delete()
        # self.delete()

    @classmethod
    def bulk_create_choices(cls, choices_data, question):
        # double check **choice_data - saw this online ;)
        choices = [cls(question=question, **choice_data) for choice_data in choices_data]
        return cls.objects.bulk_create(choices)

    @classmethod
    def bulk_update_choices(cls, choices_data, question):
        existing_choices = cls.objects.filter(question=question)

        choices_to_update = []
        for choice_data in choices_data:
            choice_id = choice_data.get("id")
            choice_obj = existing_choices.filter(id=choice_id).first()

            if choice_obj:
                for field, value in choice_data.items():
                    setattr(choice_obj, field, value)
                choices_to_update.append(choice_obj)

        if choices_to_update:
            cls.objects.bulk_update(choices_to_update, ["choice_text", "is_correct"])


class Solution(models.Model):  # Solutions: Represents correct answers to questions.
    # Fields
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    # choices - for multiple choice questions
    choices = models.ManyToManyField(Choice, blank=True,
                                     help_text="Make sure the choice question number matches.")
    # short_answer_text - for short answer questions
    short_answer_text = models.TextField(blank=True, null=True,
                                         help_text="If the question is a SA, pick any choice and fill in the text box.")

    def __str__(self):
        quiz_title = self.question.quiz.assignment.title if self.question.quiz and self.question.quiz.assignment else "Unknown Quiz"
        # (debugging) try-except can be removed once confident there's no circular logic
        try:
            if self.question.question_type == 'MC':
                return f"{quiz_title} - Solution for Question {self.question.order_of_question}: (MC)"
            elif self.question.question_type == 'SA':
                return f"{quiz_title} - Solution for Question {self.question.order_of_question}: {self.short_answer_text[:30]}"
            else:
                return f"{quiz_title} - Solution for Question {self.question.order_of_question}: (No Answer Set)"
        except RecursionError:
            return "ERROR (RecursionError)"
