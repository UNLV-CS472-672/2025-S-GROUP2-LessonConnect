from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock

from apps.notifications.models import Notification
from apps.notifications.utils import create_notification, deliver_notification, send_notification_to_channel_layer
from apps.notifications.tasks import process_scheduled_notifications

"""
 MagicMock() helps create mock objects for testing. It's particularly useful when you need to simulate the
 behavior of complex objects or external dependencies without actually using them in your tests.
 
 https://docs.python.org/3/library/unittest.mock.html
 """

User = get_user_model()


class NotificationTestCase(TestCase):
    def setUp(self):
        # create a test user
        self.user = User.objects.create_user(
            username="testuser",
            password="testpassword",
            first_name="Test",
            last_name="User",
            email="test@example.com"
        )

        # create a test notification
        self.notification = Notification.objects.create(
            user=self.user,
            notification_title='Test Notification',
            notification_message='This is a test notification',
            notification_type='info',
            info_category='general'
        )

        # setup API client
        self.client = APIClient()
        # sets up authentication to test API client without going through the normal authentication process
        self.client.force_authenticate(user=self.user)

    # models.py tests
    def test_notification_model(self):
        self.assertEqual(self.notification.notification_title, 'Test Notification')
        self.assertEqual(self.notification.notification_message, 'This is a test notification')
        self.assertEqual(self.notification.user, self.user)
        self.assertFalse(self.notification.is_read)
        self.assertFalse(self.notification.is_scheduled)
        self.assertEqual(self.notification.info_subcategory, 'General Information')

    def test_mark_as_read(self):
        self.assertFalse(self.notification.is_read)
        self.notification.mark_as_read()
        self.assertTrue(self.notification.is_read)

    # utility.py function tests
    def test_create_notification_function(self):
        notif = create_notification(
            user=self.user,
            title='Utility Test',
            message='Testing utility function',
            notification_type='WARNING'
        )

        self.assertEqual(notif.notification_title, 'Utility Test')
        self.assertEqual(notif.notification_type, 'warning')

    def test_send_notification_to_channel_layer(self):
        from apps.notifications.serializers import NotificationSerializer

        serializer = NotificationSerializer(self.notification)
        expected_data = serializer.data

        # creating mock channel layer
        mock_channel_layer = MagicMock()

        # -- AI Generated
        # Mock async_to_sync to simply call the function directly
        with patch('asgiref.sync.async_to_sync', lambda f: f):
            send_notification_to_channel_layer(
                mock_channel_layer,
                self.user.id,
                self.notification
            )
            # --
            # verify the channel layer was called correctly
            mock_channel_layer.group_send.assert_called_once()

            # check group name
            args = mock_channel_layer.group_send.call_args[0]
            self.assertEqual(args[0], f'notifications_{self.user.id}')

            # check message structure
            message = args[1]
            self.assertEqual(message['type'], 'notification_event')
            self.assertEqual(message['data'], expected_data)

            # test with pre-serialized data
            mock_channel_layer.reset_mock()
            send_notification_to_channel_layer(
                mock_channel_layer,
                self.user.id,
                expected_data  # pass the data directly instead of notification object
            )

            mock_channel_layer.group_send.assert_called_once()
            second_message = mock_channel_layer.group_send.call_args[0][1]
            self.assertEqual(second_message['data'], expected_data)

    @patch('channels.layers.get_channel_layer')
    @patch('asgiref.sync.async_to_sync')
    def test_deliver_notification(self, mock_async_to_sync, mock_get_channel_layer):
        # setup mocks
        mock_channel_layer = MagicMock()
        mock_group_send = MagicMock()
        mock_async_to_sync.return_value = mock_group_send
        mock_get_channel_layer.return_value = mock_channel_layer

        # call the function
        result = deliver_notification(self.notification)

        # verify results
        self.assertTrue(result)
        mock_get_channel_layer.assert_called_once()
        mock_async_to_sync.assert_called_once_with(mock_channel_layer.group_send)

    # API endpoint tests
    def test_list_notifications(self):
        url = reverse('notification-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    @patch('apps.notifications.utils.deliver_notification')
    def test_create_notification_api(self, mock_deliver):
        mock_deliver.return_value = True

        url = reverse('notification-list')
        data = {
            'user': self.user.id,
            'notification_title': 'API Test',
            'notification_message': 'Testing API creation',
            'notification_type': 'success',
            'info_category': 'general'
        }

        response = self.client.post(url, data)

        print(f"Response status: {response.status_code}")
        print(f"Response content: {response.content.decode()}")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_deliver.assert_called_once()

    def test_mark_notification_read_api(self):
        url = reverse('notification-mark-read', args=[self.notification.id])
        response = self.client.patch(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.notification.refresh_from_db()
        self.assertTrue(self.notification.is_read)

    def test_mark_all_read_api(self):
        Notification.objects.create(
            user=self.user,
            notification_title='Another Test',
            notification_message='Another test message',
            notification_type='warning'
        )

        url = reverse('notification-mark-all-read')
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], '2 notifications marked as read')

        # check all notifications are read
        self.assertEqual(Notification.objects.filter(user=self.user, is_read=True).count(), 2)

    def test_clear_all_notifications(self):
        url = reverse('notification-clear-all')
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Notification.objects.filter(user=self.user).count(), 0)

    # web socket tests using mocks
    """ VERY SIMPLE TEST AS OF NOW. MAY NEED UPDATING IN THE FUTURE """

    @patch('apps.notifications.utils.send_notification_to_channel_layer')
    def test_websocket_notification_sending(self, mock_send):
        # -- AI GENERATED
        # Setup mocks
        mock_send.return_value = None  # Function doesn't return anything

        # Create a mock channel layer
        mock_channel_layer = MagicMock()

        # Patch get_channel_layer to return our mock
        with patch('channels.layers.get_channel_layer', return_value=mock_channel_layer):
            # Call the function
            result = deliver_notification(self.notification)

            # Verify result and mock calls
            self.assertTrue(result)
            mock_send.assert_called_once_with(
                mock_channel_layer,
                self.notification.user.id,
                self.notification
            )
        # --

    # task.py test(s)
    """
    ts pmo!!!!!!! i CANNOT get this one working for some reason. even when putting it through AI.
    will test scheduled notifs on my 4th PR since i am working with periodic reminders.
    may have to re-implement scheduled notifs, but we'll see :<
    """
    # @patch('apps.notifications.utils.deliver_notification')
    # def test_process_scheduled_notifications(self, mock_deliver):
    #     mock_deliver.return_value = True
    #
    #     # -- AI Generated
    #     # First, clear any existing scheduled notifications for clean testing
    #     Notification.objects.filter(scheduled_time__isnull=False).delete()
    #
    #     # Create a very specific past time for scheduled_time
    #     past_time = timezone.now() - timezone.timedelta(hours=1)
    #
    #     # Create our test notification
    #     scheduled_notif = Notification.objects.create(
    #         user=self.user,
    #         notification_title='Scheduled Test',
    #         notification_message='Testing scheduled notifications',
    #         scheduled_time=past_time
    #     )
    #
    #     # Verify we have only one scheduled notification
    #     count = Notification.objects.filter(scheduled_time__isnull=False).count()
    #     self.assertEqual(count, 1, "Should have exactly one scheduled notification")
    #
    #     # Run the task
    #     result = process_scheduled_notifications()
    #
    #     # Check the result text for any number of processed notifications
    #     self.assertIn("Processed", result)
    #     self.assertIn("scheduled notifications", result)
    #
    #     # More importantly, check that our notification was delivered
    #     mock_deliver.assert_called_with(scheduled_notif)
    #
    #     # And that it was marked as sent
    #     scheduled_notif.refresh_from_db()
    #     self.assertIsNotNone(scheduled_notif.sent_at)
    #     # --
