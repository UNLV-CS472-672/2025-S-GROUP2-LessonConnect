# Generated by Django 5.1.6 on 2025-03-19 01:57

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('uploads', '0004_remove_uploadrecord_profile_uploadrecord_user'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuizSubmissions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'verbose_name': 'Quiz Submission',
                'verbose_name_plural': 'Quiz Submissions',
            },
        ),
        migrations.CreateModel(
            name='StudentQuizAnswers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('student_response', models.TextField()),
                ('is_correct', models.BooleanField(default=True)),
                ('quiz_submission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='submissions.quizsubmissions')),
            ],
            options={
                'verbose_name': 'Student Quiz Answer',
                'verbose_name_plural': 'Student Quiz Answers',
            },
        ),
        migrations.CreateModel(
            name='Submissions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('submission_status', models.CharField(blank=True, choices=[('not_submitted', 'Not Submitted'), ('late', 'Late'), ('submitted', 'Submitted')], default='not_submitted', max_length=50)),
                ('score', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('submitted_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('graded_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('student_profile', models.ForeignKey(limit_choices_to={'role': 3}, on_delete=django.db.models.deletion.CASCADE, to='users.profile')),
            ],
            options={
                'verbose_name': 'Submission',
                'verbose_name_plural': 'Submissions',
            },
        ),
        migrations.AddField(
            model_name='quizsubmissions',
            name='submission',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='submissions.submissions'),
        ),
        migrations.CreateModel(
            name='FileSubmissions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='uploads.uploadrecord')),
                ('submission', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='submissions.submissions')),
            ],
            options={
                'verbose_name': 'File Submission',
                'verbose_name_plural': 'File Submissions',
            },
        ),
    ]
