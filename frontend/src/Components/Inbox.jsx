import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import notificationService from "../Services/NotificationServices.js";
import "../Styles/Inbox.css";

export default function Inbox() {
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [activeNav, setActiveNav] = useState("Inbox");
    const [filterType, setFilterType] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch notifications when component mounts
    useEffect(() => {
        fetchNotifications();
    }, []);

    // function to fetch notifications (moved outside useEffect for reusability)
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getNotifications();

            // Transform API data to match your UI format
            const transformedData = data.map(notification => ({
                id: notification.id,
                subject: notification.notification_title,
                preview: notification.notification_message,
                date: new Date(notification.sent_at).toLocaleDateString(),
                from: notification.sender_username || "System", // use sender username if available
                unreadCount: notification.is_read ? 0 : 1,
                unread: !notification.is_read,
                type: notification.notification_type,
            }));

            setMessages(transformedData);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            setError("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    // Handles selecting a message and marking it as read
    const handleSelectMessage = async (msg) => {
        setSelectedMessage(msg);

        // Update UI immediately
        setMessages((prev) =>
            prev.map((m) =>
                m.id === msg.id ? { ...m, unread: false, unreadCount: 0 } : m
            )
        );

        // If notification is unread, mark it as read in the backend
        if (msg.unread) {
            try {
                await notificationService.markAsRead(msg.id);
            } catch (err) {
                console.error(`Error marking notification ${msg.id} as read:`, err);
            }
        }
    };

    // mark all notifications as read
    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();

            // Update UI to show all messages as read
            setMessages(prev =>
                prev.map(message => ({
                    ...message,
                    unread: false,
                    unreadCount: 0
                }))
            );
        } catch (err) {
            console.error("Failed to mark all notifications as read:", err);
            alert("Failed to mark all as read. Please try again.");
        }
    };

    // delete a specific notification
    const handleDeleteNotification = async () => {
        if (!selectedMessage) return;

        try {
            await notificationService.deleteNotification(selectedMessage.id);

            // Remove the deleted notification from state
            setMessages(prev => prev.filter(msg => msg.id !== selectedMessage.id));

            // Clear the selected message
            setSelectedMessage(null);
        } catch (err) {
            console.error(`Failed to delete notification ${selectedMessage.id}:`, err);
            alert("Failed to delete notification. Please try again.");
        }
    };

    // delete all notifications
    const handleDeleteAllNotifications = async () => {
        // Confirm before deleting all
        if (!window.confirm("Are you sure you want to delete all notifications?")) {
            return;
        }

        try {
            await notificationService.deleteAllNotifications();

            // Clear all messages from state
            setMessages([]);

            // Clear the selected message
            setSelectedMessage(null);
        } catch (err) {
            console.error("Failed to delete all notifications:", err);
            alert("Failed to delete all notifications. Please try again.");
        }
    };

    const navLinks = {
        Chat: "/chat",
        Calendar: "/calendar",
        Support: "/support",
        Profile: "/profile",
    };

    // Filter messages based on selected filter and search query
    const filteredMessages = messages
        .filter((msg) => filterType ? msg.type === filterType : true)
        .filter((msg) => searchQuery
            ? msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.preview.toLowerCase().includes(searchQuery.toLowerCase())
            : true
        );

    return (
        <div className="inbox-page">
            <div className="inbox-app">
                <div className="inbox-page-container">
                    <div className="inbox-side-menu">
                        <ul>
                            {Object.keys(navLinks).map((item) => (
                                <li
                                    key={item}
                                    className={activeNav === item ? "active" : ""}
                                    onClick={() => {
                                        setActiveNav(item);
                                        if (item !== "Inbox") {
                                            setSelectedMessage(null);
                                        }
                                    }}
                                >
                                    <Link to={navLinks[item]}>{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="inbox-thread-list">
                        <div className="inbox-toolbar">
                            <select onChange={(e) => setFilterType(e.target.value)}>
                                <option value="">All Types</option>
                                <optgroup label="Notifications">
                                    <option value="success">Success</option>
                                    <option value="warning">Warning</option>
                                    <option value="error">Error</option>
                                </optgroup>
                                <optgroup label="Information">
                                    <option value="general">General</option>
                                    <option value="update">Update</option>
                                </optgroup>
                            </select>

                            <div className="notification-actions">
                                <button onClick={handleMarkAllAsRead} className="action-button">
                                    Mark All Read
                                </button>
                                <button onClick={handleDeleteAllNotifications} className="action-button delete-button">
                                    Delete All
                                </button>
                            </div>

                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="thread-label">Notifications</div>

                        {loading ? (
                            <div>Loading notifications...</div>
                        ) : error ? (
                            <div>{error}</div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="empty-notifications">No notifications found</div>
                        ) : (
                            <ul className="message-threads">
                                {filteredMessages.map((msg) => (
                                    <li
                                        key={msg.id}
                                        className={`thread ${msg.unread ? "unread" : ""}`}
                                        onClick={() => handleSelectMessage(msg)}
                                    >
                                        <div className="thread-details">
                                            <div className="sender">{msg.from}</div>
                                            <div className="subject">{msg.subject}</div>
                                            <div className="preview">{msg.preview}</div>
                                        </div>
                                        <div className="meta">
                                            <div className="date">{msg.date}</div>
                                            {msg.unreadCount > 0 && (
                                                <div className="badge">{msg.unreadCount}</div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="inbox-content-panel">
                        <div className="inbox-content-header">
                            {selectedMessage ? selectedMessage.subject : "Notification Viewer"}
                        </div>

                        {!selectedMessage ? (
                            <div className="empty-state">
                                <div className="envelope-icon">🔔</div>
                                <p>No Notifications Selected</p>
                            </div>
                        ) : (
                            <div className="message-view">
                                <p>{selectedMessage.preview}</p>

                                <div className="message-actions">
                                    <button onClick={handleDeleteNotification} className="delete-button">
                                        Delete Notification
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
