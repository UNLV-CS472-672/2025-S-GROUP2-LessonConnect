#testing if celery works (can be deleted)
from celery import shared_task
#For periodic tasks
from celery.schedules import crontab

#shared_task:
#allows Celery to discover the task without needing a
#direct import from the Celery app
@shared_task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
