# Generated by Django 5.1.6 on 2025-04-09 05:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('planner', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='calendarevent',
            name='location',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='calendarevent',
            name='virtual',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='calendarevent',
            name='event_type',
            field=models.CharField(choices=[('lesson', 'Lesson'), ('meeting', 'Meeting'), ('reminder', 'Reminder'), ('practice', 'Practice')], default='lesson', max_length=20),
        ),
    ]
