#testing if celery works (can be deleted)
from celery import shared_task

@shared_task
def test_task():
    print("Test task executed")
