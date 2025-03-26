from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .permissions import IsAdminOrTutor
from .models import Assignment
from .serializers import AssignmentSerializer


class AssignmentDetailView(APIView):
    # Only authenticated users can access - ensures user is logged in & authenticated
    permission_classes = [IsAuthenticated]

    # Get assignment details
    def get(self, request, pk):
        # pk stands for Primary Key - just a unique id
        assignment = Assignment.get_assignment(pk)

        if not assignment:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssignmentSerializer(assignment)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    # Delete assignment (Admin/Tutor only)
    def delete(self, request, pk):
        assignment = Assignment.get_assignment(pk)

        if not assignment:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

        assignment.delete_assignment()
        return Response({"status": "success", "message": "Assignment deleted"}, status=status.HTTP_200_OK)

    # Update an assignment (Admin/Tutor only)
    def patch(self, request, pk):
        assignment = Assignment.get_assignment(pk)

        if not assignment:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssignmentSerializer(assignment, data=request.data, partial=True)

        if serializer.is_valid():
            assignment.update_assignment(serializer.validated_data)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Create an assignment (Admin/Tutor only)
class AssignmentCreateView(APIView):
    permission_classes = [IsAdminOrTutor]  # Only Admin and Tutor allowed

    def post(self, request):
        serializer = AssignmentSerializer(data=request.data)

        # Check that created assignment serializer was created
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
