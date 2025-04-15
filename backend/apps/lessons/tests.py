from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
# from apps.lessons.models import Assignment, Quiz, Question, Choice
from .models import Assignment, Quiz, Question, Choice

class AssignmentAPITests(APITestCase):
    def setUp(self):
        # Create an admin user (superuser) for testing
        self.user = User.objects.create_superuser(
            username='testadmin', password='testpassword', email='test@test.com'
        )

        # Get access token
        response = self.client.post(
            reverse('token_obtain_pair'),  # Use the actual name of the URL if configured
            {'username': 'testadmin', 'password': 'testpassword'},
        )
        self.access_token = response.data['access']

        # Set authorization header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        # Create an initial assignment for testing
        self.assignment = Assignment.objects.create(
            title="Initial Assignment",
            description="Initial assignment description.",
            assignment_type="QZ",
            deadline="2025-12-01T12:00:00Z",
        )
        # Create a quiz for testing questions
        self.quiz = Quiz.objects.create(
            assignment=self.assignment,
            time_limit=30,
            num_of_questions=10,
            attempts=1,
            is_active=True
        )

        # Define URLs
        self.detail_url = reverse('assignment-detail', kwargs={'pk': self.assignment.pk})
        self.create_url = reverse('assignment-create')

        # Unless you want to hardcode:
        # self.list_url = '/lessons/assignments/'
        # self.detail_url = f'/lessons/assignments/{self.assignment.pk}/'
        # self.create_url = '/lessons/assignments/create/'

    # Test GET single assignment
    def test_get_assignment(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['title'], 'Initial Assignment')

    # Test POST create new assignment
    def test_create_assignment(self):
        data = {
            "title": "New Assignment",
            "description": "This is a new assignment.",
            "assignment_type": "HW",
            "deadline": "2025-12-01T12:00:00Z"
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['data']['title'], 'New Assignment')

    # Test PATCH update assignment
    def test_update_assignment(self):
        data = {"title": "Updated Title"}
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['title'], 'Updated Title')

    # Test DELETE assignment
    def test_delete_assignment(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')

        # Further verify that it is deleted
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

# ----------------------- + ------------------------------
# Quiz testing zone:
    # Test POST creating a quiz (from an assignment in setup)
    def test_create_quiz(self):
        url = reverse('quiz-list-create', kwargs={'assignment_id': self.assignment.id})
        data = {"assignment": self.assignment.id, "time_limit": 30, "num_of_questions": 30, "attempts": 1,
                "is_active": False}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['data']['assignment'], self.assignment.id)
        # EXTRA: Check that the assignment linked to the quiz has the correct title
        quiz = Quiz.objects.get(pk=response.data['data']['id'])
        self.assertEqual(quiz.assignment.title, "Initial Assignment")

    # Test GET list of quizzes (made from 1 assignment)
    def test_get_quiz_list(self):
        # Create a couple of quizzes for the same assignment
        Quiz.objects.create(assignment=self.assignment, time_limit=20, num_of_questions=10, attempts=1, is_active=True)
        Quiz.objects.create(assignment=self.assignment, time_limit=30, num_of_questions=20, attempts=2, is_active=False)

        url = reverse('quiz-list-create', kwargs={'assignment_id': self.assignment.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Expecting 2 quizzes to be returned + 1 self made one (used for questions)
        self.assertEqual(len(response.data['data']), 3)

    # Test GET single quiz
    def test_get_quiz_detail(self):
        # Create a quiz instance to retrieve
        quiz = Quiz.objects.create(assignment=self.assignment, time_limit=45, num_of_questions=15, attempts=3,
                                   is_active=True)
        url = reverse('quiz-detail', kwargs={'assignment_id': self.assignment.id, 'quiz_id': quiz.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['id'], quiz.id)
        self.assertEqual(response.data['data']['assignment'], self.assignment.id)

    # Test PATCH update quiz
    def test_update_quiz(self):
        # Create a quiz instance to update
        quiz = Quiz.objects.create(assignment=self.assignment, time_limit=40, num_of_questions=25, attempts=2,
                                   is_active=False)
        url = reverse('quiz-detail', kwargs={'assignment_id': self.assignment.id, 'quiz_id': quiz.id})
        data = {"is_active": True, "time_limit": 50}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # EXTRA: Refresh instance from database to check updates
        quiz.refresh_from_db()
        self.assertTrue(quiz.is_active)
        self.assertEqual(quiz.time_limit, 50)

    # Test DELETE quiz
    def test_delete_quiz(self):
        # Create a quiz instance to delete
        quiz = Quiz.objects.create(assignment=self.assignment, time_limit=30, num_of_questions=30, attempts=1,
                                   is_active=True)
        url = reverse('quiz-detail', kwargs={'assignment_id': self.assignment.id, 'quiz_id': quiz.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        # Verify deletion: subsequent GET should return 404
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

# ----------------------- + ------------------------------
# Quiz-question testing zone:
    # Test GET a list of questions for a given quiz
    def test_get_question_list(self):
        # Create two questions for self.quiz
        Question.objects.create(
            quiz=self.quiz,
            question_type='MC',
            order_of_question=1,
            question_text="What is 2+2?",
            points=1
        )
        Question.objects.create(
            quiz=self.quiz,
            question_type='SA',
            order_of_question=2,
            question_text="Describe gravity in one sentence.",
            points=2
        )
        url = reverse(
            'quiz-question-list',
            kwargs={'assignment_id': self.assignment.id, 'quiz_id': self.quiz.id}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify: 2 questions are returned
        self.assertEqual(len(response.data['data']), 2)

    # Test POST creating a new question for a quiz
    def test_create_question(self):
        url = reverse(
            'question-create',
            kwargs={'assignment_id': self.assignment.id, 'quiz_id': self.quiz.id}
        )
        data = {
            "question_type": "MC",
            "order_of_question": 1,
            "question_text": "What is the capital of France?",
            "points": 1
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Ensure the response contains the quiz id and correct question details
        self.assertEqual(response.data['data']['quiz'], self.quiz.id)
        self.assertEqual(response.data['data']['question_text'], "What is the capital of France?")

    # Test PUT updating an existing question
    def test_update_question(self):
        # Create a question to update
        question = Question.objects.create(
            quiz=self.quiz,
            question_type='MC',
            order_of_question=1,
            question_text="Old question text",
            points=1
        )
        url = reverse(
            'question-update',
            kwargs={'assignment_id': self.assignment.id, 'quiz_id': self.quiz.id, 'question_id': question.id}
        )
        update_data = {
            "question_text": "Updated question text",
            "points": 5
        }
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        question.refresh_from_db()  # Refresh the question from the DB and verify updates
        self.assertEqual(question.question_text, "Updated question text")
        self.assertEqual(question.points, 5)

    # Test DELETE question
    def test_delete_question(self):
        # Create a question to delete
        question = Question.objects.create(
            quiz=self.quiz,
            question_type='MC',
            order_of_question=1,
            question_text="Question to be deleted",
            points=1
        )
        url = reverse(
            'question-delete',
            kwargs={'assignment_id': self.assignment.id, 'quiz_id': self.quiz.id, 'question_id': question.id}
        )
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        # Verify that the question no longer exists in the database
        self.assertIsNone(Question.get_question(question.id))

# ----------------------- + ------------------------------
# Choices testing zone:
