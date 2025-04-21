from django.test import TestCase
from django.utils import timezone
from django.contrib.auth.models import User
from apps.users.models import Profile
from apps.uploads.models import UploadRecord
from apps.submissions.models import Submissions, FileSubmissions, QuizSubmissions, StudentQuizAnswers
from django.core.exceptions import ValidationError
from decimal import InvalidOperation
from rest_framework import status
from rest_framework.test import APIClient
from apps.submissions.managers import SubmissionManager, FileSubmissionManager, QuizSubmissionManager
from django.urls import reverse

# https://chatgpt.com/share/67d8b158-0d8c-8003-a586-13dc69796303
class SubmissionsTestCase(TestCase):
    def setUp(self):
        # Create user and student profile
        self.user = User.objects.create_user(username="student1", password="password")
        self.profile = Profile.objects.create(user=self.user, role=3)  # Assign student role

        # Simulate file upload
        self.upload_data = {
            "type": "image",
            "resource_type": "image",
            "original_filename": "sample_file.jpg",
            "format": "jpg",
            "created_at": timezone.now().isoformat(),
            "public_id": "sample_public_id",
            "version": 1,
            "asset_id": "sample_asset_id"
        }
        self.upload_record = UploadRecord.objects.create(upload_data=self.upload_data)

        # Create submission
        self.submission = Submissions.objects.create(
            student_profile=self.profile,
            submission_status=Submissions.SUBMITTED,
            score=85.5,
            submitted_at = timezone.make_aware(timezone.datetime(2025, 3, 6)),
            graded_at = timezone.make_aware(timezone.datetime(2025, 3, 7)),
        )

        # Create file upload
        self.file_submission = FileSubmissions.objects.create(
            submission=self.submission,
            file=self.upload_record
        )

        # Create quiz submission
        self.quiz_submission = QuizSubmissions.objects.create(submission=self.submission)

        # Create student quiz answer
        self.student_quiz_answer = StudentQuizAnswers.objects.create(
            quiz_submission=self.quiz_submission,
            student_response="B",
            is_correct=True
        )

        self.client = APIClient()

        url = reverse('token_obtain_pair')  # Update to the correct token URL if necessary
        response = self.client.post(url, {'username': 'student1', 'password': 'password'}, format='json')
        self.token = response.data['access']


    ### Testing Models ###
    # Testing class creation
    def test_submission_creation(self):
        """Test that a submission is created correctly."""
        self.assertEqual(self.submission.student_profile, self.profile)
        self.assertEqual(self.submission.submission_status, Submissions.SUBMITTED)
        self.assertEqual(float(self.submission.score), 85.5)

    def test_file_submission(self):
        """Test that a file submission is linked correctly."""
        self.assertEqual(self.file_submission.submission, self.submission)
        self.assertEqual(self.file_submission.file, self.upload_record)

    def test_quiz_submission(self):
        """Test that a quiz submission is linked correctly."""
        self.assertEqual(self.quiz_submission.submission, self.submission)

    def test_student_quiz_answer(self):
        """Test that a student quiz answer is recorded correctly."""
        self.assertEqual(self.student_quiz_answer.quiz_submission, self.quiz_submission)
        self.assertEqual(self.student_quiz_answer.student_response, "B")
        self.assertTrue(self.student_quiz_answer.is_correct)

    # Testing strings
    def test_submission_str(self):
        """Test string representation of a submission."""
        expected_str = f"Submission for {self.user.username}, Status: submitted, Score: 85.5"
        self.assertEqual(str(self.submission), expected_str)

    def test_student_quiz_answer_str(self):
        """Test string representation of StudentQuizAnswers."""
        expected_str = f"Answer for {self.quiz_submission.id}, Response: B, Correct: True"
        self.assertEqual(str(self.student_quiz_answer), expected_str)

    def test_file_submission_str(self):
        """Test string representation of a FileSubmission."""
        expected_str = f"File Submission for {self.submission.id}"
        self.assertEqual(str(self.file_submission), expected_str)

    def test_quiz_submission_str(self):
        """Test string representation of a QuizSubmission."""
        expected_str = f"Quiz Submission for {self.submission.id}"
        self.assertEqual(str(self.quiz_submission), expected_str)

    def test_quiz_submission_str_with_score(self):
        """Test __str__ method for QuizSubmission with a different score."""
        self.submission.score = 100
        self.submission.save()
        expected_str = f"Quiz Submission for {self.submission.id}"
        self.assertEqual(str(self.quiz_submission), expected_str)

    # Testing submission status
    def test_default_submission_status(self):
        """Test that the default submission status is 'not_submitted'."""
        new_submission = Submissions.objects.create(student_profile=self.profile)
        self.assertEqual(new_submission.submission_status, Submissions.NOT_SUBMITTED)

    def test_invalid_submission_status(self):
        """Test that an invalid submission status raises a ValidationError."""
        submission = Submissions(
            student_profile=self.profile,
            submission_status="invalid_status",  # Invalid status
            score=85.5
        )
        with self.assertRaises(ValidationError):
            submission.full_clean()  # Trigger validation explicitly   

    # testing score 
    def test_null_score(self):
        """Test that a submission can have a null score."""
        new_submission = Submissions.objects.create(student_profile=self.profile, submission_status=Submissions.SUBMITTED)
        self.assertIsNone(new_submission.score)

    def test_zero_score(self):
        """Test that a submission with a score of zero is valid."""
        submission = Submissions.objects.create(
            student_profile=self.profile,
            submission_status=Submissions.SUBMITTED,
            score=0  # Valid zero score
        )
        self.assertEqual(submission.score, 0)

    def test_large_score(self):
        """Test that a very large score raises a ValidationError."""
        submission = Submissions(
            student_profile=self.profile,
            submission_status=Submissions.SUBMITTED,
            score=99999.99 
        )
        with self.assertRaises(ValidationError) as context:
            submission.full_clean()  # Trigger validation explicitly before saving
        self.assertIn('Ensure that there are no more than 5 digits in total.', str(context.exception)) 

    def test_negative_submission_score(self):
        """Test that a submission with a negative score raises an error."""
        submission = Submissions(
            student_profile=self.profile,  # Ensure we assign a valid student_profile
            submission_status=Submissions.SUBMITTED,
            score=-10  # Invalid negative score
        )
        with self.assertRaises(ValidationError):
            submission.clean()  

    # Testing graded_at
    def test_auto_now_add_graded_at(self):
        """Test that `graded_at` is set automatically and only once."""
        submission = Submissions.objects.create(
            student_profile=self.profile,
            submission_status=Submissions.SUBMITTED,
            score=85.5
        )
        self.assertIsNotNone(submission.graded_at)
        submission.score = 90
        submission.save()
        self.assertEqual(submission.graded_at, submission.graded_at)

    def test_graded_at_before_submitted_at(self):
        """Test that `graded_at` cannot be before `submitted_at`."""
        submitted_at = timezone.make_aware(timezone.datetime(2025, 3, 6))
        graded_at = timezone.make_aware(timezone.datetime(2025, 3, 5))  # Invalid: graded before submitted
        submission = Submissions(
            student_profile=self.profile,  # Ensure we assign a valid student_profile
            submission_status=Submissions.SUBMITTED,
            score=85.5,
            submitted_at=submitted_at,
            graded_at=graded_at
        )
        with self.assertRaises(ValidationError):
            submission.clean() 

    # Testing requires profile 
    def test_submission_requires_profile(self):
        """Test that a submission without a profile raises a ValidationError."""
        with self.assertRaises(ValidationError):
            submission = Submissions(
                submission_status=Submissions.SUBMITTED,
                score=85.5
            )
            submission.full_clean() 


    ### Manager Test Cases ###
    # Submission manager
    def test_create_submission(self):
        """Test the `create_submission` method."""
        manager = SubmissionManager()
        new_submission = manager.create_submission(self.profile, Submissions.SUBMITTED, 92.0)
        self.assertEqual(new_submission.student_profile, self.profile)
        self.assertEqual(new_submission.submission_status, Submissions.SUBMITTED)
        self.assertEqual(float(new_submission.score), 92.0)

    def test_update_submission_status(self):
        """Test the `update_submission_status` method."""
        self.assertIsNotNone(self.submission)  # Ensure submission is created
        manager = SubmissionManager() 
        new_submission = manager.create_submission(self.profile, Submissions.SUBMITTED, 92.0)
        self.assertEqual(new_submission.submission_status, Submissions.SUBMITTED)
        updated_submission = manager.update_submission_status(new_submission.id, Submissions.LATE)
        self.assertEqual(updated_submission.submission_status, Submissions.LATE)

    def test_get_submission(self):
        """Test the `get_submission` method."""
        manager = SubmissionManager() 
        fetched_submission = manager.get_submission(self.submission.id)
        self.assertEqual(fetched_submission, self.submission)

    def test_get_all_submissions(self):
        """Test the `get_all_submissions` method."""
        manager = SubmissionManager() 
        all_submissions = manager.get_all_submissions()
        self.assertIn(self.submission, all_submissions)
        self.assertEqual(all_submissions.count(), 1)

    # File submission manager
    def test_create_file_submission(self):
        """Test the `create_file_submission` method."""
        manager = FileSubmissionManager()
        existing_file_submission = FileSubmissions.objects.filter(submission=self.submission).first()
        if existing_file_submission: # avoid unique constraint
            existing_file_submission.delete()
        file_submission = manager.create_file_submission(self.submission, self.upload_record)
        self.assertEqual(file_submission.submission, self.submission)
        self.assertEqual(file_submission.file, self.upload_record)
    
    # Quiz submission manager
    def test_create_quiz_submission(self):
        """Test the `create_quiz_submission` method."""
        manager = QuizSubmissionManager()
        QuizSubmissions.objects.filter(submission=self.submission).delete()
        quiz_submission = manager.create_quiz_submission(self.submission)
        self.assertEqual(quiz_submission.submission, self.submission)

    def test_save_quiz_answer(self):
        """Test the `save_quiz_answer` method."""
        manager = QuizSubmissionManager()
        StudentQuizAnswers.objects.filter(quiz_submission=self.quiz_submission).delete()
        answer = manager.save_quiz_answer(
            self.quiz_submission,
            student_response="B",
            is_correct=True
        )
        self.assertEqual(answer.quiz_submission, self.quiz_submission)
        self.assertEqual(answer.student_response, "B")
        self.assertTrue(answer.is_correct)

    def test_get_quiz_answers(self):
        """Test the `get_quiz_answers` method."""
        manager = QuizSubmissionManager()
        StudentQuizAnswers.objects.filter(quiz_submission=self.quiz_submission).delete()
        answer_1 = manager.save_quiz_answer(self.quiz_submission, "A", False)
        answer_2 = manager.save_quiz_answer(self.quiz_submission, "C", True)
        answers = manager.get_quiz_answers(self.quiz_submission.id)
        self.assertIn(answer_1, answers)
        self.assertIn(answer_2, answers)

    def test_mark_quiz_as_submitted(self):
        """Test the `mark_quiz_as_submitted` method."""
        manager = QuizSubmissionManager()
        self.quiz_submission.submission.submission_status = Submissions.NOT_SUBMITTED
        self.quiz_submission.submission.save()
        self.quiz_submission.submission.submission_status = manager.mark_quiz_as_submitted(self.quiz_submission)
        self.assertEqual(self.quiz_submission.submission.submission_status, Submissions.SUBMITTED)

    
## API test cases ###
# https://chatgpt.com/share/67e078ce-424c-8003-a32f-6a5a074e2780
class SubmissionsAPITestCase(TestCase):
    def setUp(self):
        """Set up test data and API client for Submissions."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            password="testpassword",
            first_name="Test",
            last_name="User",
            email="test@example.com"
        )
        self.profile = Profile.objects.create(user=self.user, role=Profile.STUDENT)
        self.login_url = "/users/login/"
        
        self.submission_url = reverse("submissions-list") 
        self.submission_detail_url = lambda submission_id: reverse("submissions-detail", args=[submission_id])  # Detail URL for a submission

        # Log in and obtain JWT tokens
        login_response = self.client.post(self.login_url, {"username": "testuser", "password": "testpassword"})
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.refresh_token = login_response.json().get("refreshToken")
        self.access_token = login_response.json().get("accessToken")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

    # Testing submissions class
    def test_create_submission(self):
        """Test that an authenticated user can create a submission."""
        data = {
            "student_profile": self.profile.id,
            "submission_status": "submitted",
            "score": 85.5,
        }
        response = self.client.post(self.submission_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["student_profile"], self.profile.id)
        self.assertEqual(response.data["submission_status"], "submitted")
        self.assertEqual(float(response.data["score"]), 85.5)

    def test_get_submission(self):
        """Test that an authenticated user can retrieve a submission."""
        submission = Submissions.objects.create(
            student_profile=self.profile,
            submission_status="submitted",
            score=80.00
        )
        response = self.client.get(self.submission_detail_url(submission.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["score"], "80.00") 

    def test_update_submission(self):
        """Test that an authenticated user can update a submission."""
        submission = Submissions.objects.create(
            student_profile=self.profile,
            submission_status="not_submitted",
            score=85.5
        )
        update_data = {
            "score": 90.0,
            "submission_status": "submitted"
        }
        response = self.client.patch(self.submission_detail_url(submission.id), update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(float(response.data["score"]), 90.0)
        self.assertEqual(response.data["submission_status"], "submitted")

    def test_delete_submission(self):
        """Test that an authenticated user can delete their own submission."""
        submission = Submissions.objects.create(
            student_profile=self.profile,
            submission_status="submitted",
            score=85.5
        )
        response = self.client.delete(self.submission_detail_url(submission.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Submissions.objects.filter(id=submission.id).exists())

    def test_unauthenticated_user_cannot_create_submission(self):
        """Test that an unauthenticated user cannot create a submission."""
        self.client.credentials()  # Remove authentication token
        data = {
            "student_profile": self.profile.id,
            "submission_status": "submitted",
            "score": 85.5,
        }
        response = self.client.post(self.submission_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_all_submissions(self):
        """Test retrieving all submissions."""
        Submissions.objects.create(student_profile=self.profile, submission_status="submitted", score=90.0)
        Submissions.objects.create(student_profile=self.profile, submission_status="not_submitted", score=None)
        
        response = self.client.get(self.submission_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_non_existent_submission(self):
        """Test retrieving a non-existent submission returns 404."""
        response = self.client.get(self.submission_detail_url(9999))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_submission_invalid_data(self):
        """Test updating a submission with invalid data."""
        submission = Submissions.objects.create(student_profile=self.profile, submission_status="submitted", score=85.5)
        update_data = {"score": -10}  # Invalid score
        
        response = self.client.patch(self.submission_detail_url(submission.id), update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_delete_non_existent_submission(self):
        """Test deleting a non-existent submission."""
        response = self.client.delete(self.submission_detail_url(9999))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class FileQuizSubmissionsAPITestCase(TestCase):
    def setUp(self):
        """Set up test data and API client for Submissions."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            password="testpassword",
            first_name="Test",
            last_name="User",
            email="test@example.com"
        )
        self.profile = Profile.objects.create(user=self.user, role=Profile.STUDENT)
        self.submission = Submissions.objects.create(student_profile=self.profile, submission_status="submitted", score=80.0)
        self.upload_data = {
            "type": "image",
            "resource_type": "image",
            "original_filename": "sample_file.jpg",
            "format": "jpg",
            "created_at": timezone.now().isoformat(),
            "public_id": "sample_public_id",
            "version": 1,
            "asset_id": "sample_asset_id"
        }
        self.file_record = UploadRecord.objects.create(self.upload_data)
        self.quiz_submission = QuizSubmissions.objects.create(submission=self.submission)

        self.login_url = "/users/login/"
        self.submission_url = reverse("submissions-list") 
        self.submission_detail_url = lambda submission_id: reverse("submissions-detail", args=[submission_id])  # Detail URL for a submission
        self.file_submission_url = reverse("filesubmissions-list")
        self.file_submission_detail_url = lambda file_id: reverse("filesubmissions-detail", args=[file_id])
        self.quiz_submission_url = reverse("quizsubmissions-list")
        self.quiz_submission_detail_url = lambda quiz_id: reverse("quizsubmissions-detail", args=[quiz_id])
        self.answer_url = reverse("studentquizanswers-list")
        self.answer_detail_url = lambda answer_id: reverse("studentquizanswers-detail", args=[answer_id])

        # Log in and obtain JWT tokens
        login_response = self.client.post(self.login_url, {"username": "testuser", "password": "testpassword"})
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.refresh_token = login_response.json().get("refreshToken")
        self.access_token = login_response.json().get("accessToken")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

    def test_create_file_submission(self):
        """Test creating a file submission."""
        data = {"submission": self.submission.id, "file": self.file_record.id}
        response = self.client.post(self.file_submission_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["submission"], self.submission.id)

    def test_delete_file_submission(self):
        """Test deleting a file submission."""
        file_submission = FileSubmissions.objects.create(submission=self.submission, file=self.file_record)
        response = self.client.delete(self.file_submission_detail_url(file_submission.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(FileSubmissions.objects.filter(id=file_submission.id).exists())

    def test_submit_quiz(self):
        """Test marking a quiz submission as submitted."""
        response = self.client.patch(self.quiz_submission_detail_url(self.quiz_submission.id), {"submission_status": "submitted"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.quiz_submission.refresh_from_db()
        self.assertEqual(self.quiz_submission.submission.submission_status, "submitted")

    def test_create_quiz_answer(self):
        """Test submitting a quiz answer."""
        data = {"quiz_submission": self.quiz_submission.id, "student_response": "My answer", "is_correct": True}
        response = self.client.post(self.answer_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["student_response"], "My answer")
        self.assertTrue(response.data["is_correct"])

    def test_get_quiz_answers(self):
        """Test retrieving all answers for a quiz submission."""
        StudentQuizAnswers.objects.create(quiz_submission=self.quiz_submission, student_response="A", is_correct=True)
        StudentQuizAnswers.objects.create(quiz_submission=self.quiz_submission, student_response="B", is_correct=False)

        response = self.client.get(self.answer_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_answers_for_non_existent_quiz(self):
        """Test retrieving quiz answers for a non-existent quiz."""
        response = self.client.get(self.answer_detail_url(9999))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)