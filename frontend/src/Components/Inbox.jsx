import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/Inbox.css";

// Utility to convert ISO string to readable date (e.g., Apr 9, 2025)
const formatDate = (isoDate) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(isoDate).toLocaleDateString(undefined, options);
};

export default function Inbox() {
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [activeNav, setActiveNav] = useState("Inbox");
    const [filterType, setFilterType] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Mock data — transformed to match frontend fields
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Simulated API response from backend
        const backendResponse = [
            {
                id: 1,
                notification_title: "New Tutoring Request",
                notification_message: "Hi there! I'm looking for help with algebra...",
                created_at: "2025-04-04T15:30:00Z",
                sender: "Alex Morgan",
                unread_count: 1,
                is_unread: true,
                type: "general",
            },
            {
                id: 2,
                notification_title: "Follow-up on Geometry Session",
                notification_message: "Thanks for yesterday’s session. I had a question about...",
                created_at: "2025-04-02T10:00:00Z",
                sender: "Taylor Brooks",
                unread_count: 0,
                is_unread: false,
                type: "info",
            },
            {
                id: 3,
                notification_title: "Schedule Confirmation",
                notification_message: "Just confirming our next meeting time works for you...",
                created_at: "2025-03-30T14:00:00Z",
                sender: "Jordan Lee",
                unread_count: 3,
                is_unread: true,
                type: "update",
            },
            {
                id: 4,
                notification_title: "Schedule Confirmation",
                notification_message: "Just confirming our next meeting time works for you...",
                created_at: "2025-03-30T14:00:00Z",
                sender: "Jordan Lee",
                unread_count: 3,
                is_unread: true,
                type: "error",
            },
        ];

        // Map backend format to frontend fields
        const mapped = backendResponse.map((n) => ({
            id: n.id,
            subject: n.notification_title,
            preview: n.notification_message,
            date: formatDate(n.created_at),
            from: n.sender,
            unreadCount: n.unread_count,
            unread: n.is_unread,
            type: n.type,
        }));

        setMessages(mapped);
    }, []);

    const handleSelectMessage = (msg) => {
        setSelectedMessage(msg);
        setMessages((prev) =>
            prev.map((m) =>
                m.id === msg.id ? { ...m, unread: false, unreadCount: 0 } : m
            )
        );
    };

    const navLinks = {
        Chat: "/chat",
        Calendar: "/calendar",
        Support: "/support",
        Profile: "/profile",
    };

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

                        <ul className="message-threads">
                            {messages
                                .filter((msg) =>
                                    filterType ? msg.type === filterType : true
                                )
                                .filter((msg) =>
                                    searchQuery
                                        ? msg.preview
                                            .toLowerCase()
                                            .includes(searchQuery.toLowerCase())
                                        : true
                                )
                                .map((msg) => (
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
                    </div>

                    <div className="inbox-content-panel">
                        <div className="inbox-content-header">
                            {selectedMessage
                                ? selectedMessage.subject
                                : "Notification Viewer"}
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