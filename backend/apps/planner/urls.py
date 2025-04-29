from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CalendarEventViewSet, UnscheduledTaskViewSet

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'calendar', CalendarEventViewSet)
router.register(r'unscheduled-tasks', UnscheduledTaskViewSet, basename='unscheduledtask')


urlpatterns = [
    path('', include(router.urls)),
    path('api/', include(router.urls))
]
