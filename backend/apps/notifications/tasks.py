from celery import shared_task
from django.utils import timezone
import datetime
from django.contrib.auth import get_user_model
from apps.notifications.utils import create_notification
from apps.notifications.models import Notification

User = get_user_model()


@shared_task
def send_session_reminders():
    """
    Send reminders for upcoming sessions.
    Works with the Profile and Session models.
    """
    now = timezone.now()
    # find sessions in the next 24 hours
    tomorrow = now + datetime.timedelta(days=1)

    from apps.sessions.models import Session
    upcoming_sessions = Session.objects.filter(
        start_time__gte=now,
        start_time__lte=tomorrow,
        status=Session.SCHEDULED,
        reminder_sent=False
    )

    reminders_sent = 0
    for session in upcoming_sessions:
        # calculate hours until session
        time_diff = session.start_time - now
        hours_until = time_diff.total_seconds() / 3600

        # different messages based on time remaining
        if hours_until <= 1:
            priority = 'high'
            time_msg = "in 1 hour"
        elif hours_until <= 3:
            priority = 'medium'
            time_msg = "in a few hours"
        else:
            priority = 'low'
            time_msg = "tomorrow"

        # send to student
        student_user = session.student.user
        create_notification(
            user=student_user,
            title="Upcoming Tutoring Session",
            message=f"You have a session with {session.tutor.user.get_full_name()} {time_msg}.",
            notification_type='info',
            info_category='general',
            priority=priority
        )

        # send to tutor
        tutor_user = session.tutor.user
        create_notification(
            user=tutor_user,
            title="Upcoming Tutoring Session",
            message=f"You have a session with {session.student.user.get_full_name()} {time_msg}.",
            notification_type='info',
            info_category='general',
            priority=priority
        )

        # find parents associated with the student and notify them
        # assuming there's a way to find parent profiles linked to a student
        parent_profiles = session.student.get_parents()

        for parent_profile in parent_profiles:
            parent_user = parent_profile.user
            create_notification(
                user=parent_user,
                title="Child's Upcoming Tutoring Session",
                message=f"{session.student.user.first_name} has a session with {session.tutor.user.get_full_name()} {time_msg}.",
                notification_type='info',
                info_category='general',
                priority=priority
            )

        # mark that we've sent the reminder
        session.reminder_sent = True
        session.save(update_fields=['reminder_sent'])
        reminders_sent += 1

    return f"Processed {reminders_sent} session reminders"


@shared_task
def send_assignment_reminders():
    """
    Send reminders for pending assignments.
    Works with your existing Assignment model.
    """
    now = timezone.now()

    from apps.lessons.models import Assignment

    # find assignments due in the next 48 hours
    two_days_from_now = now + datetime.timedelta(days=2)

    pending_assignments = Assignment.objects.filter(
        deadline__gte=now,
        deadline__lte=two_days_from_now,
        reminder_sent=False
    )

    reminders_sent = 0
    for assignment in pending_assignments:
        # calculate days until due
        time_diff = assignment.deadline - now
        days_until = time_diff.total_seconds() / (24 * 3600)

        # set priority based on urgency
        if days_until < 0.5:  # less than 12 hours
            priority = 'high'
            time_msg = "due today"
        elif days_until < 1:  # less than 24 hours
            priority = 'medium'
            time_msg = "due tomorrow"
        else:
            priority = 'low'
            time_msg = f"due in {int(days_until)} days"

        # notify student
        student_user = assignment.student
        create_notification(
            user=student_user,
            title="Assignment Reminder",
            message=f"Your assignment '{assignment.title}' is {time_msg}.",
            notification_type='warning',
            priority=priority
        )

        # if the student has a profile and parents, notify the parents
        from apps.users.models import Profile
        try:
            student_profile = Profile.objects.get(user=student_user, role=Profile.STUDENT)
            parent_profiles = student_profile.get_parents()  # implement this method

            for parent_profile in parent_profiles:
                parent_user = parent_profile.user
                create_notification(
                    user=parent_user,
                    title="Child's Assignment Reminder",
                    message=f"{student_user.first_name}'s assignment '{assignment.title}' is {time_msg}.",
                    notification_type='info',
                    priority=priority
                )
        except Profile.DoesNotExist:
            # student might not have a profile
            pass

        # mark that we've sent the reminder
        assignment.reminder_sent = True
        assignment.save(update_fields=['reminder_sent'])
        reminders_sent += 1

    return f"Processed {reminders_sent} assignment reminders"
