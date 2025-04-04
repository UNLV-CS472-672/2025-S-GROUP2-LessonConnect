# Generated by Django 5.1.6 on 2025-03-22 05:33

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lessons', '0003_question_points'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='quiz',
            options={'verbose_name': 'Quiz', 'verbose_name_plural': 'Quizzes'},
        ),
        migrations.AlterField(
            model_name='assignment',
            name='assignment_type',
            field=models.CharField(choices=[('EX', 'Exercises'), ('HW', 'Homework'), ('QZ', 'Quiz'), ('TT', 'Tests'), ('EC', 'Extra Credit')], max_length=2),
        ),
        migrations.AlterField(
            model_name='assignment',
            name='deadline',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='assignment',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='assignment',
            name='student',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assignments', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='quiz',
            name='attempts',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(1)]),
        ),
        migrations.AlterField(
            model_name='quiz',
            name='time_limit',
            field=models.IntegerField(blank=True, help_text='Time limit for the quiz (in minutes)', null=True),
        ),
    ]
