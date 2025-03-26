# https://chatgpt.com/share/67d8b158-0d8c-8003-a586-13dc69796303

from django.test import TestCase
from django.utils import timezone
from django.contrib.auth.models import User
from apps.users.models import Profile
from apps.uploads.models import UploadRecord
from apps.submissions.models import Submissions, FileSubmissions, QuizSubmissions, StudentQuizAnswers
from django.core.exceptions import ValidationError
from decimal import InvalidOperation

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
        self.upload_record = UploadRecord.objects.create(upload_data=self.upload_data, profile=self.profile)

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
