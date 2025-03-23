from django.db import models
from django.apps import apps

class SubmissionManager(models.Manager):
    # POST /submissions/: Create a new submission
    def create_submission(self, student_profile, submission_status=None, score=None):
        """Helper method to create a new submission"""
        Submissions = apps.get_model('submissions', 'Submissions')  # Dynamically import the Submissions model
        submission = Submissions.objects.create(
            student_profile=student_profile,
            submission_status=submission_status or Submissions.NOT_SUBMITTED,
            score=score
        )
        return submission

    def update_submission_status(self, submission_id, status):
        """Update the status of a submission"""
        Submissions = apps.get_model('submissions', 'Submissions')
        submission = Submissions.objects.get(pk=submission_id)  # Directly use Submissions.objects.get
        submission.submission_status = status
        submission.save()
        return submission

    # GET /submissions/{submission_id}/: Retrieve a specific submission.
    def get_submission(self, submission_id):
        """Retrieve a specific submission by ID"""
        Submissions = apps.get_model('submissions', 'Submissions')
        return Submissions.objects.get(id=submission_id)

    # GET /submissions/: Retrieves all submissions
    def get_all_submissions(self):
        """Retrieve all submissions"""
        Submissions = apps.get_model('submissions', 'Submissions') 
        return Submissions.objects.all()

class FileSubmissionManager(models.Manager):
    # POST /submissions/: Create a new submission (file)
    def create_file_submission(self, submission, file):
        """Helper method to create a file submission"""
        FileSubmissions = apps.get_model('submissions', 'FileSubmissions') 
        file_submission = FileSubmissions.objects.create(
            submission=submission,
            file=file
        )
        return file_submission

class QuizSubmissionManager(models.Manager):
    # POST /submissions/: Create a new submission (quiz)
    def create_quiz_submission(self, submission):
        """Create a new quiz submission entry"""
        QuizSubmissions = apps.get_model('submissions', 'QuizSubmissions') 
        quiz_submission = QuizSubmissions.objects.create(
            submission=submission
        )
        return quiz_submission

    # POST /submissions/quizzes/{submission_id}/answers/: Saves an answer to a specific quiz question.
    def save_quiz_answer(self, quiz_submission, student_response, is_correct):
        """Save a student’s answer to a quiz question"""
        StudentQuizAnswers = apps.get_model('submissions', 'StudentQuizAnswers') 
        answer = StudentQuizAnswers.objects.create(
            quiz_submission=quiz_submission,
            student_response=student_response,
            is_correct=is_correct
        )
        return answer

    # GET /submissions/quizzes/{submission_id}/answers/: Fetches all answers for a student’s quiz attempt.
    def get_quiz_answers(self, quiz_submission_id):
        """Fetch all answers for a specific quiz submission"""
        StudentQuizAnswers = apps.get_model('submissions', 'StudentQuizAnswers') 
        return StudentQuizAnswers.objects.filter(quiz_submission_id=quiz_submission_id)

    # POST /submissions/quizzes/{submission_id}/submit/: Marks the quiz as submitted.
    def mark_quiz_as_submitted(self, quiz_submission):
        """Mark a quiz submission as submitted"""
        Submissions = apps.get_model('submissions', 'Submissions')
        quiz_submission.submission.submission_status = Submissions.SUBMITTED
        quiz_submission.submission.save()
        return quiz_submission.submission.submission_status

