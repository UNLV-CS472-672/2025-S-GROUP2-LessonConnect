# Generated by Django 5.1.6 on 2025-03-08 00:45

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UploadRecord',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('public_id', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('cloudinary_public_id', models.CharField(max_length=255)),
                ('resource_type', models.CharField(max_length=50)),
                ('file_name', models.CharField(max_length=100)),
                ('file_format', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField()),
                ('type', models.CharField(max_length=50)),
                ('version', models.PositiveBigIntegerField()),
                ('description', models.TextField(blank=True, null=True)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.profile')),
            ],
        ),
    ]
