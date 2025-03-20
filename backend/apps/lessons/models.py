from django.db import models


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

    # MediaUpload (ForeignKey to MediaUploads once MediaUploads model is set up) TODO: would that be UploadRecord
    # media_upload = models.ForeignKey('MediaUploads', on_delete=models.SET_NULL, null=True, blank=True)

    # Student (ForeignKey to Student once Student model is set up)
    # student = models.ForeignKey('Student', on_delete=models.CASCADE)
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

    def __str__(self):
        if self.question.question_type == 'MC':
            correct_choices = ", ".join(choice.choice_text for choice in self.choices.all())
            return f"Solution for Question {self.question.id}: {correct_choices}"
        elif self.question.question_type == 'SA':
            return f"Solution for Question {self.question.id}: {self.short_answer_text[:30]}"
        else:
            return f"Solution for Question {self.question.id}: (No Answer Set)"
