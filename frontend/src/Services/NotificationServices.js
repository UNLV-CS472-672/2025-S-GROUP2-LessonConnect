import axios from 'axios';

// create a notification service with all required methods
const notificationService = {
    // cet all notifications for the current user
    getNotifications: async () => {
        try {
            // get the token from storage
            const token = localStorage.getItem('accessToken');

            const response = await axios.get('http://127.0.0.1:8000/notifications/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    // mark a notification as read
    markAsRead: async (id) => {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await axios.patch(`http://127.0.0.1:8000/notifications/${id}/mark-read/`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error(`Error marking notification ${id} as read:`, error);
            throw error;
        }
    },

    // mark all notifications as read
    markAllAsRead: async () => {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await axios.post('http://127.0.0.1:8000/notifications/mark-all-read/', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    },

    // delete a notification
    deleteNotification: async (id) => {
        try {
            const token = localStorage.getItem('accessToken');

            await axios.delete(`http://127.0.0.1:8000/notifications/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return true;
        } catch (error) {
            console.error(`Error deleting notification ${id}:`, error);
            throw error;
        }
    },

    // delete all notifications
    deleteAllNotifications: async () => {
        try {
            const token = localStorage.getItem('accessToken');

            await axios.delete('http://127.0.0.1:8000/notifications/clear-all/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return true;
        } catch (error) {
            console.error('Error deleting all notifications:', error);
            throw error;
        }
    }
};

export default notificationService;
