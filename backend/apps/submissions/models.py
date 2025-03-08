from django.db import models
from django.utils import timezone

### Missing fields will be added in as other apps are updated

class Submissions(models.Model):
    student_profile = models.ForeignKey('users.Profile', on_delete=models.CASCADE, limit_choices_to={'role': 3})
    ### assignment = models.ForeignKey("app.Assignment", on_delete=models.CASCADE)
    submissionStatus = models.CharField(max_length=50, default='Not Submitted')
    score = models.DecimalField(max_digits=5, decimal_places=2)
    submittedAt = models.DateField(default=timezone.now)
    gradedAt = models.DateField(default=timezone.now)
    def __str__(self):
        return f"Submission for {self.student_profile.user.username}, Status: {self.submissionStatus}, Score: {self.score}"

class FileSubmissions(models.Model):
    submission = models.OneToOneField(Submissions, on_delete=models.CASCADE)
    ### file = models.ForeignKey('app.MediaUploads', on_delete=models.CASCADE)
    def __str__(self):
        return f"File Submission for Submission ID {self.submission.id}"

class QuizSubmissions(models.Model):
    submission = models.OneToOneField(Submissions, on_delete=models.CASCADE)
    ### quiz = models.ForeignKey('app.Quiz', on_delete=models.CASCADE)
    def __str__(self):
        return f"Quiz Submission for Submission ID {self.submission.id}"

class StudentQuizAnswers(models.Model):
    submission = models.ForeignKey(QuizSubmissions, on_delete=models.CASCADE)
    ### question = models.ForeignKey('app.Question', on_delete=models.CASCADE)
    studentResponse = models.TextField()
    isCorrect = models.BooleanField(default=True)
    def __str__(self):
        return f"Answer for Submission ID {self.submission.id}, Response: {self.studentResponse}, Correct: {self.isCorrect}"
