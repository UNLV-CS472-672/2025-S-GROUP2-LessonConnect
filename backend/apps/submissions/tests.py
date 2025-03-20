# https://chatgpt.com/share/67d8b158-0d8c-8003-a586-13dc69796303

from django.test import TestCase
from django.utils import timezone
from django.contrib.auth.models import User
from apps.users.models import Profile
from apps.uploads.models import UploadRecord
from apps.submissions.models import Submissions, FileSubmissions, QuizSubmissions, StudentQuizAnswers


class SubmissionTestCase(TestCase):
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
        self.upload_record = UploadRecord.objects.create(upload_data=self.upload_data, user=self.user)

        # Create submission
        self.submission = Submissions.objects.create(
            student_profile=self.profile,
            submission_status=Submissions.SUBMITTED,
            score=85.5,
            submitted_at=timezone.datetime(2025, 3, 6),
            graded_at=timezone.datetime(2025, 3, 7),
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

    def test_submission_str(self):
        """Test string representation of a submission."""
        expected_str = f"Submission for {self.user.username}, Status: submitted, Score: 85.5"
        self.assertEqual(str(self.submission), expected_str)

    def test_default_submission_status(self):
        """Test that the default submission status is 'not_submitted'."""
        new_submission = Submissions.objects.create(student_profile=self.profile)
        self.assertEqual(new_submission.submission_status, Submissions.NOT_SUBMITTED)

    def test_null_score(self):
        """Test that a submission can have a null score."""
        new_submission = Submissions.objects.create(student_profile=self.profile, submission_status=Submissions.SUBMITTED)
        self.assertIsNone(new_submission.score)

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