# Generated by Django 5.1.6 on 2025-03-18 05:37

import apps.search.models
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, unique=True)),
                ('category', models.ForeignKey(default=apps.search.models.get_default_category, on_delete=django.db.models.deletion.CASCADE, related_name='subjects', to='search.category')),
            ],
            options={
                'db_table': 'apps_users_subject',
            },
        ),
    ]
