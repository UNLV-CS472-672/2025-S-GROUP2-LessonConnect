from django.db import models

# Create your models here.

"""
Assignments: Represents assignments given to individual students.
Example Fields: Title, Description, assignmentType (CharField), 
                MediaUpload (ForeignKey to MediaUploads once 
                MediaUploads model is set up), Student (ForeignKey
                to Student once Student model is set up), deadline.
"""
class Assignment(models.Model):
    ASSIGNMENT_TYPES = [
        ('EX', 'Exercises'),
        ('HW', 'Homework'),
        ('QZ', 'Quiz'),
        ('TT', 'Tests')
        # todo: maybe needs more ???
    ]
    # Fields
    title = models.CharField(max_length=200)
    description = models.TextField()
    assignment_type = models.CharField(max_length=2, choices=ASSIGNMENT_TYPES)
    media_upload = models.ForeignKey('MediaUploads', on_delete=models.SET_NULL, null=True, blank=True)
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    deadline = models.DateTimeField()

    def __str__(self):
        return self.title


"""
Quizzes: Represents quizzes linked to assignments.
Example Fields: Assignment (ForeignKey to Assigments), timeLimit,
                numOfQuestions, Attempts, isActive.
"""
class Quiz(models.Model):
    # Fields
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    time_limit = models.PositiveIntegerField(help_text="Time limit for the quiz (in minutes)")
    num_of_questions = models.PositiveIntegerField()
    attempts = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Quiz for {self.assignment.title}"  # todo: CHECK IF THIS WORKS WITHIN SHELL/ADMIN!!!


"""
Questions: Represents individual questions within a quiz.
Example Fields: Quiz (ForeignKey to Quizzes), questionType (charfield),
                orderOfQuestions, questionText.
"""
class Question(models.Model):
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


"""
Choices: Store the possible answer choices for multiple choice questions.
Example Fields: Question (ForeignKey to Questions), choiceText, isCorrect.
"""
class Choice(models.Model):
    # Fields
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="choices")
    choice_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Choice: {self.choice_text} ({'Correct' if self.is_correct else 'Incorrect'})"


"""
Solutions: Represents correct answers to questions.
Example Fields: Question (ForeignKey to Questions), choices (ManyToManyField
                to Choices) for multiple choice questions, shortAnswerText
                for short answer questions.
"""
class Solution(models.Model):
    # Fields
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choices = models.ManyToManyField(Choice, blank=True)
    short_answer_text = models.TextField(blank=True, null=True)

    def __str__(self):
        if self.question.question_type == 'MC':
            correct_choices = ", ".join(choice.choice_text for choice in self.choices.all())
            return f"Solution for Question {self.question.id}: {correct_choices}"
        elif self.question.question_type == 'SA':
            return f"Solution for Question {self.question.id}: {self.short_answer_text[:30]}"
        else:
            return f"Solution for Question {self.question.id}: (No Answer Set)"
