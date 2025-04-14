from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CalendarEventViewSet

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'calendar', CalendarEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
