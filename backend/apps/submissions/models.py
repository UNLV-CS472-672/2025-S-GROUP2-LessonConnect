from django.db import models
from django.utils import timezone

### Missing fields will be added in as other apps are updated

class Submissions(models.Model):
    # constants for submission status 
    NOT_SUBMITTED = 'not_submitted'
    LATE = 'late'
    SUBMITTED = 'submitted'

    # choices for the submission status field
    SUBMISSION_STATUS_CHOICES = [
        (NOT_SUBMITTED, 'Not Submitted'),
        (LATE, 'Late'),
        (SUBMITTED, 'Submitted'),
    ]

    # submission fields 
    student_profile = models.ForeignKey(
        'users.Profile', 
        on_delete=models.CASCADE, 
        limit_choices_to={'role': 3} # only students submitting for now?
    )
    ### assignment = models.ForeignKey("app.Assignment", on_delete=models.CASCADE)
    submission_status = models.CharField(
        max_length=50, 
        choices=SUBMISSION_STATUS_CHOICES,
        default=NOT_SUBMITTED,
        blank=True
    )
    score = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True
    )
    submitted_at = models.DateTimeField(default=timezone.now)  # Changed to DateTimeField for better accuracy
    graded_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)  # Ensures it's only set once

    def __str__(self):
        return (
            f"Submission for {self.student_profile.user.username}, "
            f"Status: {self.submission_status}, "
            f"Score: {self.score}"
        )
    
    class Meta:
        verbose_name = "Submission"
        verbose_name_plural = "Submissions"
    
class FileSubmissions(models.Model):
    # file submission fields 
    submission = models.OneToOneField(Submissions, on_delete=models.CASCADE)
    file = models.ForeignKey(
        'uploads.UploadRecord', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )

    def __str__(self):
        return f"File Submission for {self.submission.id}"
    
    class Meta:
        verbose_name = "File Submission"
        verbose_name_plural = "File Submissions"

class QuizSubmissions(models.Model):
    # quiz submission fields
    submission = models.OneToOneField(Submissions, on_delete=models.CASCADE)
    ### quiz = models.ForeignKey('app.Quiz', on_delete=models.CASCADE)

    def __str__(self):
        return f"Quiz Submission for {self.submission.id}"
    
    class Meta:
        verbose_name = "Quiz Submission"
        verbose_name_plural = "Quiz Submissions"

class StudentQuizAnswers(models.Model):
    # student quiz answer fields
    quiz_submission = models.ForeignKey(QuizSubmissions, on_delete=models.CASCADE)
    ### question = models.ForeignKey('app.Question', on_delete=models.CASCADE)
    student_response = models.TextField()
    is_correct = models.BooleanField(default=True)

    def __str__(self):
        return (
            f"Answer for {self.quiz_submission.id}, "
            f"Response: {self.student_response}, "
            f"Correct: {self.is_correct}"
        )
    class Meta:
        verbose_name = "Student Quiz Answer"
        verbose_name_plural = "Student Quiz Answers"