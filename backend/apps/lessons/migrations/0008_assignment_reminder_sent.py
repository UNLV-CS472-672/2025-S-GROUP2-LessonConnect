# Generated by Django 5.1.6 on 2025-04-20 04:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lessons', '0006_assignment_upload_record'),
    ]

    operations = [
        migrations.AddField(
            model_name='assignment',
            name='reminder_sent',
            field=models.BooleanField(default=False),
        ),
    ]
