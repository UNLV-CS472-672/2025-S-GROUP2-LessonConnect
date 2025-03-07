import os
from celery import Celery
from celery.schedules import crontab

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')
# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

''' CONFIGURATIONS FOR NOTIFICATIONS '''
# https://docs.celeryq.dev/en/latest/userguide/periodic-tasks.html
app.conf.beat_schedule = {
    'check-scheduled-notifications': {
        'task': 'your_app.tasks.process_scheduled_notifications',
        'schedule': crontab(minute='*/5'),  # run every 5 minutes.
    },
}

