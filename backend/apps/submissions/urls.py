from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubmissionsViewSet, FileSubmissionsViewSet, QuizSubmissionsViewSet, StudentQuizAnswersViewSet

# Create a router and register your viewsets
router = DefaultRouter()
router.register(r'submissions', SubmissionsViewSet)
router.register(r'file-submissions', FileSubmissionsViewSet)
router.register(r'quiz-submissions', QuizSubmissionsViewSet)
router.register(r'student-quiz-answers', StudentQuizAnswersViewSet)

# urlpatterns = [
#     # Include the router URLs in your app's URLs
#     path('', include(router.urls)),
# ]

urlpatterns = [
    path('api/', include(router.urls)),
]
