# Generated by Django 5.1.6 on 2025-04-15 04:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0006_chat_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='status',
            field=models.PositiveSmallIntegerField(choices=[(1, 'Seen'), (2, 'Not seen'), (3, 'Not sent')], default=2),
        ),
    ]
