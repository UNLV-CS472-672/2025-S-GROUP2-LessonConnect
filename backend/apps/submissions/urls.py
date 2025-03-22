from django.urls import path
from . import views

urlpatterns = [
    path('submissions/', views.CreateSubmissionView.as_view(), name='create_submission'),
    path('submissions/<int:submission_id>/', views.SubmissionDetailView.as_view(), name='submission_detail'),
    path('submissions/', views.ListSubmissionsView.as_view(), name='list_submissions'),
    path('submissions/<int:submission_id>/status/', views.UpdateSubmissionStatusView.as_view(), name='update_submission_status'),

    path('submissions/quizzes/', views.CreateQuizSubmissionView.as_view(), name='create_quiz_submission'),
    path('submissions/quizzes/<int:submission_id>/answers/', views.SaveQuizAnswerView.as_view(), name='save_quiz_answer'),
    path('submissions/quizzes/<int:submission_id>/submit/', views.SubmitQuizView.as_view(), name='submit_quiz'),
    path('submissions/quizzes/<int:submission_id>/answers/', views.GetQuizAnswersView.as_view(), name='get_quiz_answers'),
]
