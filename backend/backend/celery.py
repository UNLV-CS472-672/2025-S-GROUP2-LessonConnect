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
app.conf.beat_schedule = {
    # define task routes based on priority
    'notifications.tasks.deliver_notification_high': {'queue': 'high_priority'},
    'notifications.tasks.deliver_notification_medium': {'queue': 'medium_priority'},
    'notifications.tasks.deliver_notification_low': {'queue': 'low_priority'},
    'notifications.tasks.send_session_reminders': {'queue': 'reminders'},
    'notifications.tasks.send_assignment_reminders': {'queue': 'reminders'},
}

# configure queue priorities
app.conf.task_queue_max_priority = {
    'high_priority': 10,
    'medium_priority': 5,
    'low_priority': 1,
}

# configure task acks late to ensure tasks are processed
app.conf.task_acks_late = True

# configure time limits
app.conf.task_time_limit = {
    # 'high_priority': 60,  # 1 minute
    # 'medium_priority': 300,  # 5 minutes
    # 'low_priority': 1800,  # 30 minutes

    # for testing purposes
    'high_priority': 5,  # 5 sec
    'medium_priority': 15,  # 15 sec
    'low_priority': 30,  # 30 sec
}

# define the beat schedule - when periodic tasks should run
app.conf.beat_schedule = {
    'session-reminders-morning': {
        'task': 'notifications.tasks.send_session_reminders',
        'schedule': crontab(hour=8, minute=0),  # Run daily at 8:00 AM
        'options': {'queue': 'reminders'},
    },
    'assignment-reminders-morning': {
        'task': 'notifications.tasks.send_assignment_reminders',
        'schedule': crontab(hour=8, minute=0),  # Run daily at 8:00 AM
        'options': {'queue': 'reminders'},
    },
    'assignment-reminders-evening': {
        'task': 'notifications.tasks.send_assignment_reminders',
        'schedule': crontab(hour=18, minute=0),  # Run daily at 6:00 PM
        'options': {'queue': 'reminders'},
    },
    'process-scheduled-notifications': {
        'task': 'notifications.tasks.process_scheduled_notifications',
        'schedule': crontab(minute='*/5'),  # Run every 5 minutes
    },
}

# when executed, it prints information about the task request itself, showing details like task ID, arguments,
# and other metadata
@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
