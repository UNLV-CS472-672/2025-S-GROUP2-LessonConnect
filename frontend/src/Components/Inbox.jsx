import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import notificationService from "../Services/NotificationServices.js";
import "../Styles/Inbox.css";

export default function Inbox() {
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [activeNav, setActiveNav] = useState("Inbox");
    const [filterType, setFilterType] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getNotifications();

            const transformedData = data.map(notification => ({
                id: notification.id,
                subject: notification.notification_title,
                preview: notification.notification_message,
                date: new Date(notification.sent_at).toLocaleDateString(),
                from: notification.sender_username || "System",
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

    const handleSelectMessage = async (msg) => {
        setSelectedMessage(msg);
        setMessages((prev) =>
            prev.map((m) =>
                m.id === msg.id ? { ...m, unread: false, unreadCount: 0 } : m
            )
        );

        if (msg.unread) {
            try {
                await notificationService.markAsRead(msg.id);
            } catch (err) {
                console.error(`Error marking notification ${msg.id} as read:`, err);
            }
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
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

    const handleDeleteNotification = async () => {
        if (!selectedMessage) return;

        try {
            await notificationService.deleteNotification(selectedMessage.id);
            setMessages(prev => prev.filter(msg => msg.id !== selectedMessage.id));
            setSelectedMessage(null);
        } catch (err) {
            console.error(`Failed to delete notification ${selectedMessage.id}:`, err);
            alert("Failed to delete notification. Please try again.");
        }
    };

    const handleDeleteAllNotifications = async () => {
        if (!window.confirm("Are you sure you want to delete all notifications?")) return;

        try {
            await notificationService.deleteAllNotifications();
            setMessages([]);
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

    const filteredMessages = messages.filter((msg) =>
        filterType ? msg.type === filterType : true
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
                                        if (item !== "Inbox") setSelectedMessage(null);
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
                                <button onClick={handleDeleteAllNotifications} className="action-button">
                                    Delete All
                                </button>
                            </div>
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
                            <div className="header-title">
                                {selectedMessage ? selectedMessage.subject : "Notification Viewer"}
                            </div>
                            <div className="message-actions">
                                <button
                                    onClick={handleDeleteNotification}
                                    className="delete-button"
                                    disabled={!selectedMessage}
                                >
                                    Delete Notification
                                </button>
                            </div>
                        </div>

                        {!selectedMessage ? (
                            <div className="empty-state">
                                <div className="envelope-icon">🔔</div>
                                <p>No Notifications Selected</p>
                            </div>
                        ) : (
                            <div className="message-view">
                                <p>{selectedMessage.preview}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
