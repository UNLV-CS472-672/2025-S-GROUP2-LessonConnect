from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
# from apps.lessons.models import Assignment, Quiz, Question, Choice, Solution
from .models import Assignment, Quiz, Question, Choice, Solution

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

        # Create an initial assignment for assignment & quiz testing
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
        # Create a question for testing choices (used 'MC' for multiple choice)
        self.question = Question.objects.create(
            quiz=self.quiz,
            question_type="MC",
            order_of_question=1,
            question_text="What is the color of the sky?",
            points=1
        )

        # Define URLs - used for assignment testing
        self.detail_url = reverse('assignment-detail', kwargs={'pk': self.assignment.pk})
        self.create_url = reverse('assignment-create')
        self.list_url = reverse('assignment-list')

        # Unless you want to hardcode:
        # self.list_url = '/lessons/assignments/'
        # self.detail_url = f'/lessons/assignments/{self.assignment.pk}/'
        # self.create_url = '/lessons/assignments/create/'

    # Test GET: List all assignments
    def test_list_assignments(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Should return a list under "data"
        self.assertIn('data', response.data)
        assignments = response.data['data']
        self.assertIsInstance(assignments, list)

        # At least the one created in setUp must be present
        ids = [a['id'] for a in assignments]
        self.assertIn(self.assignment.pk, ids)

    # Test GET: Retrieve a single assignment
    def test_get_assignment(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['title'], 'Initial Assignment')

    # Test POST: Create a new assignment
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

    # Test PATCH: Update an existing assignment
    def test_update_assignment(self):
        data = {"title": "Updated Title"}
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['title'], 'Updated Title')

    # Test DELETE: Delete an assignment
    def test_delete_assignment(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        # Further verify that it is deleted
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

# ----------------------- + ------------------------------
# Quiz testing zone:
    # Test POST: Create a quiz (directly tied to an assignment in setup)
    def test_create_quiz(self):
        url = reverse('quiz-list-create', kwargs={'assignment_id': self.assignment.id})
        data = {"assignment": self.assignment.id, "time_limit": 30, "num_of_questions": 30, "attempts": 1,
                "is_active": False}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['data']['assignment'], self.assignment.id)
        # Verify: Check that the assignment linked to the quiz has the correct title
        quiz = Quiz.objects.get(pk=response.data['data']['id'])
        self.assertEqual(quiz.assignment.title, "Initial Assignment")

    # Test GET: Retrieve a list of quizzes (made from a single assignment)
    def test_get_quiz_list(self):
        # Create a couple of quizzes for the same assignment
        Quiz.objects.create(assignment=self.assignment, time_limit=20, num_of_questions=10, attempts=1, is_active=True)
        Quiz.objects.create(assignment=self.assignment, time_limit=30, num_of_questions=20, attempts=2, is_active=False)

        url = reverse('quiz-list-create', kwargs={'assignment_id': self.assignment.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Expecting 2 quizzes to be returned + 1 self-made one (used later for questions)
        self.assertEqual(len(response.data['data']), 3)

    # Test GET: Retrieve a single quiz
    def test_get_quiz_detail(self):
        # Create a quiz instance to retrieve
        quiz = Quiz.objects.create(assignment=self.assignment, time_limit=45, num_of_questions=15, attempts=3,
                                   is_active=True)

        url = reverse('quiz-detail', kwargs={'assignment_id': self.assignment.id, 'quiz_id': quiz.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['id'], quiz.id)
        self.assertEqual(response.data['data']['assignment'], self.assignment.id)

    # Test PATCH: Update quiz
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

    # Test DELETE: Delete a quiz
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
    # Test GET: Retrieve a list of questions for a given quiz
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

        url = reverse('quiz-question-list',
                      kwargs={'assignment_id': self.assignment.id, 'quiz_id': self.quiz.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify: 2 questions are returned + 1 self-made one (used later for choices)
        self.assertEqual(len(response.data['data']), 3)

    # Test POST: Create a new question for a quiz
    def test_create_question(self):
        url = reverse('question-create',
                      kwargs={'assignment_id': self.assignment.id, 'quiz_id': self.quiz.id})
        data = {
            "question_type": "MC",
            "order_of_question": 1,
            "question_text": "What is the capital of France?",
            "points": 1
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Verify/Ensure the response contains the quiz id and correct question details
        self.assertEqual(response.data['data']['quiz'], self.quiz.id)
        self.assertEqual(response.data['data']['question_text'], "What is the capital of France?")

    # Test PUT: Update an existing question
    def test_update_question(self):
        # Create a question to update
        question = Question.objects.create(
            quiz=self.quiz,
            question_type='MC',
            order_of_question=1,
            question_text="Old question text",
            points=1
        )

        url = reverse('question-update',
                      kwargs={'assignment_id': self.assignment.id, 'quiz_id': self.quiz.id, 'question_id': question.id})
        update_data = {
            "question_text": "Updated question text",
            "points": 5
        }
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        question.refresh_from_db()  # Refresh the question from the DB and verify updates
        self.assertEqual(question.question_text, "Updated question text")
        self.assertEqual(question.points, 5)

    # Test DELETE: Delete a question
    def test_delete_question(self):
        # Create a question to delete
        question = Question.objects.create(
            quiz=self.quiz,
            question_type='MC',
            order_of_question=1,
            question_text="Question to be deleted",
            points=1
        )

        url = reverse('question-delete',
                      kwargs={'assignment_id': self.assignment.id, 'quiz_id': self.quiz.id, 'question_id': question.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        # Verify that the question no longer exists in the database
        self.assertIsNone(Question.get_question(question.id))

# ----------------------- + ------------------------------
# Choices testing zone:
    # Test GET: Retrieve a list of choices for a given question
    def test_get_choice_list(self):
        # Create two choices associated with the (setup) question
        Choice.objects.create(question=self.question, choice_text="Blue", is_correct=True)
        Choice.objects.create(question=self.question, choice_text="Red", is_correct=False)

        url = reverse("choice-list",
                      kwargs={"assignment_id": self.assignment.id, "quiz_id": self.quiz.id,
                              "question_id": self.question.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify that two choices are returned
        self.assertEqual(len(response.data["data"]), 2)

    # Test POST: Bulk-create choices for a given question
    def test_create_choices(self):
        url = reverse("choice-create",
                      kwargs={"assignment_id": self.assignment.id, "quiz_id": self.quiz.id,
                              "question_id": self.question.id})
        # choices data with multiple choices
        choices_payload = {
            "choices": [{"choice_text": "Blue", "is_correct": True}, {"choice_text": "Green", "is_correct": False}]
        }
        response = self.client.post(url, choices_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Verify that 2 choices were created and associated with the question
        self.assertEqual(len(response.data["data"]), 2)
        for choice_data in response.data["data"]:
            self.assertEqual(choice_data["question"], self.question.id)

    # Test PUT: Bulk-update choices for a given question
    def test_update_choices(self):
        # Create two initial choices
        choice1 = Choice.objects.create(question=self.question, choice_text="Blue", is_correct=True)
        choice2 = Choice.objects.create(question=self.question, choice_text="Green", is_correct=False)

        url = reverse("choice-update",
                      kwargs={"assignment_id": self.assignment.id, "quiz_id": self.quiz.id,
                              "question_id": self.question.id})
        # Data with multiple choices
        update_data = {
            "choices": [
                {"id": choice1.id, "choice_text": "Navy Blue", "is_correct": True},
                {"id": choice2.id, "choice_text": "Lime Green", "is_correct": True}
            ]
        }
        response = self.client.put(url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_choices = response.data["data"]
        self.assertEqual(len(updated_choices), 2)
        # Reload the choices from the database and verify updates - AI & Websearch assisted
        for updated in updated_choices:
            choice_obj = Choice.objects.get(id=updated["id"])
            expected = next(item for item in update_data["choices"] if item["id"] == updated["id"])
            self.assertEqual(choice_obj.choice_text, expected["choice_text"])
            self.assertEqual(choice_obj.is_correct, expected["is_correct"])

    # Test DELETE: Delete all choices for a question
    def test_delete_choices(self):
        # Create multiple (3) choices for the (setup) question
        Choice.objects.create(question=self.question, choice_text="Blue", is_correct=True)
        Choice.objects.create(question=self.question, choice_text="Green", is_correct=False)
        Choice.objects.create(question=self.question, choice_text="Red", is_correct=False)

        url = reverse("choice-delete",
                      kwargs={"assignment_id": self.assignment.id, "quiz_id": self.quiz.id,
                              "question_id": self.question.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        # Verify that the choices are actually deleted. A follow-up GET request should return no choices.
        list_url = reverse("choice-list",
                           kwargs={"assignment_id": self.assignment.id, "quiz_id": self.quiz.id,
                                   "question_id": self.question.id})
        get_response = self.client.get(list_url)
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_response.data["data"]), 0)

# ----------------------- + ------------------------------
# Solutions testing zone:
    # Test GET: Retrieve a solution for a question
    def test_get_solution_detail(self):
        # Create a choice and a solution instance for the question
        choice = Choice.objects.create(question=self.question, choice_text="Blue", is_correct=True)
        solution = Solution.objects.create(question=self.question)
        solution.choices.add(choice)

        url = reverse("solution-detail",
                      kwargs={"assignment_id": self.assignment.id, "quiz_id": self.quiz.id,
                              "question_id": self.question.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data["data"]
        self.assertEqual(data["question"], self.question.id)
        # Verify the returned solution has the correct number of associated choices.
        self.assertEqual(len(data["choices"]), 1)

    # Test POST: Create a new solution by providing choices (or a short answer)
    def test_create_solution(self):
        # For an MC question, create a choice to associate with the solution.
        choice = Choice.objects.create(question=self.question, choice_text="Blue", is_correct=True)

        url = reverse("solution-create",
                      kwargs={"assignment_id": self.assignment.id, "quiz_id": self.quiz.id,
                              "question_id": self.question.id})
        data = {
            "choices": [choice.id]
            # For a short answer question, you might include: "short_answer_text": "Your answer"
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["data"]["question"], self.question.id)
        # Verify the created solution includes the provided choice
        self.assertIn(choice.id, response.data["data"]["choices"])

    # Test PUT: Update an existing solution
    def test_update_solution(self):
        # Create an initial solution with a short answer
        solution = Solution.objects.create(question=self.question, short_answer_text="Initial solution text")

        url = reverse("solution-update",
                      kwargs={"assignment_id": self.assignment.id, "quiz_id": self.quiz.id,
                              "question_id": self.question.id})
        update_data = {"short_answer_text": "Updated solution text"}
        response = self.client.put(url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Refresh the solution from the database and verify the update
        solution.refresh_from_db()
        self.assertEqual(solution.short_answer_text, "Updated solution text")

    # Test DELETE: Delete a solution
    def test_delete_solution(self):
        # Create a solution to delete
        solution = Solution.objects.create(question=self.question, short_answer_text="Solution to be deleted")

        url = reverse("solution-delete",
                      kwargs={"assignment_id": self.assignment.id, "quiz_id": self.quiz.id,
                              "question_id": self.question.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        # Verify deletion by attempting to retrieve the solution and expecting a 404.
        get_url = reverse("solution-detail",
                          kwargs={"assignment_id": self.assignment.id, "quiz_id": self.quiz.id,
                                  "question_id": self.question.id})
        get_response = self.client.get(get_url)
        self.assertEqual(get_response.status_code, status.HTTP_404_NOT_FOUND)
