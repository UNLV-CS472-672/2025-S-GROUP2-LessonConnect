from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'bookings', views.BookingViewSet)

urlpatterns = [
    path('', include(router.urls), name='bookings_api'),
    path('reviews/', views.get_reviews, name='get_reviews'),
    path('reviews/submit/', views.submit_review, name='submit_reviews'),
]
