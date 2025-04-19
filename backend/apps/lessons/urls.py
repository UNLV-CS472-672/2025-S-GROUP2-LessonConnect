from django.urls import path
from .views import (
    AssignmentDetailView,
    AssignmentCreateView,
    QuizListCreateView,
    QuizDetailView,
    QQuestionListView,
    QuestionCreateView,
    QuestionUpdateView,
    QuestionDeleteView,
    ChoiceListView,
    ChoiceCreateView,
    ChoiceUpdateView,
    ChoiceDeleteView,
    SolutionDetailView,
    SolutionCreateView,
    SolutionUpdateView,
    SolutionDeleteView
)

urlpatterns = [
    # CRUD endpoints for Assignments
    path("assignments/<int:pk>/", AssignmentDetailView.as_view(), name="assignment-detail"),
    path("assignments/create/", AssignmentCreateView.as_view(), name="assignment-create"),

    # CRUD endpoints for Quizzes and Questions
    # - QUIZ
    path("assignments/<int:assignment_id>/quizzes/",
         QuizListCreateView.as_view(), name="quiz-list-create"),
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/",
         QuizDetailView.as_view(), name="quiz-detail"),
    # - QUIZ Questions
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/",
         QQuestionListView.as_view(), name="quiz-question-list"),
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/create/",
         QuestionCreateView.as_view(), name="question-create"),
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/<int:question_id>/update/",
         QuestionUpdateView.as_view(), name="question-update"),
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/<int:question_id>/delete/",
         QuestionDeleteView.as_view(), name="question-delete"),

    # CRUD endpoints for Choices
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/<int:question_id>/choices/",
         ChoiceListView.as_view(), name="choice-list"),
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/<int:question_id>/choices/create/",
         ChoiceCreateView.as_view(), name="choice-create"),
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/<int:question_id>/choices/update/",
         ChoiceUpdateView.as_view(), name="choice-update"),
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/<int:question_id>/choices/delete/",
         ChoiceDeleteView.as_view(), name="choice-delete"),

    # CRUD endpoints for Solutions
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/<int:question_id>/solution/",
         SolutionDetailView.as_view(), name="solution-detail"),
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/<int:question_id>/solution/create/",
         SolutionCreateView.as_view(), name="solution-create"),
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/<int:question_id>/solution/update/",
         SolutionUpdateView.as_view(), name="solution-update"),
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/<int:question_id>/solution/delete/",
         SolutionDeleteView.as_view(), name="solution-delete")
]
