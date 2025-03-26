from django.urls import path
from .views import (
    AssignmentDetailView,
    AssignmentCreateView,
    QuizQuestionListView,
    QuestionCreateView,
    QuestionUpdateView,
    QuestionDeleteView
)

urlpatterns = [
    # CRUD endpoints for Assignments
    path("assignments/<int:pk>/", AssignmentDetailView.as_view(), name="assignment-detail"),
    path("assignments/create/", AssignmentCreateView.as_view(), name="assignment-create"),

    # CRUD endpoints for Quizzes and Questions
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/",
         QuizQuestionListView.as_view(), name="quiz-question-list"),

    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/create/",
         QuestionCreateView.as_view(), name="question-create"),
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/<int:question_id>/update/",
         QuestionUpdateView.as_view(), name="question-update"),
    path("assignments/<int:assignment_id>/quiz/<int:quiz_id>/questions/<int:question_id>/delete/",
         QuestionDeleteView.as_view(), name="question-delete"),
]
