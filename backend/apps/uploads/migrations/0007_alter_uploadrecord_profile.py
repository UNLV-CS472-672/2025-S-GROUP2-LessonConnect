# Generated by Django 5.1.6 on 2025-03-26 04:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('uploads', '0006_remove_profilepicture_profile_uploadrecord_profile'),
        ('users', '0009_alter_tutorprofile_rating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uploadrecord',
            name='profile',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='upload_record', to='users.profile'),
        ),
    ]
