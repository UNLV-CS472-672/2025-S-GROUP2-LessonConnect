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
                    from: "System", // Default sender
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

        fetchNotifications();
    }, []);

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
                                <option value="info">Information</option>
                                <option value="success">Success</option>
                                <option value="warning">Warning</option>
                                <option value="error">Error</option>
                            </select>

                            <select disabled>
                                <option>Schedule</option>
                            </select>

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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}