from rest_framework.permissions import BasePermission


# Custom permission to allow access to admins and tutors only.
class IsAdminOrTutor(BasePermission):
    def has_permission(self, request, view):
        # Allow access if user is an admin or has role as tutor
        return request.user.is_staff or (hasattr(request.user, 'profile') and request.user.profile.role == 1)
