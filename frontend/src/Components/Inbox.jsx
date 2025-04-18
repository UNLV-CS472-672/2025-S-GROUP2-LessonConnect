import { useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/Inbox.css";

export default function Inbox() {
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [activeNav, setActiveNav] = useState("Inbox");
    const [filterType, setFilterType] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [messages, setMessages] = useState([
        {
            id: 1,
            subject: "New Tutoring Request",
            preview: "Hi there! I'm looking for help with algebra...",
            date: "Apr 4, 2025",
            from: "Alex Morgan",
            unreadCount: 1,
            unread: true,
            type: "general",
        },
        {
            id: 2,
            subject: "Follow-up on Geometry Session",
            preview: "Thanks for yesterday’s session. I had a question about...",
            date: "Apr 2, 2025",
            from: "Taylor Brooks",
            unreadCount: 0,
            unread: false,
            type: "info",
        },
        {
            id: 3,
            subject: "Schedule Confirmation",
            preview: "Just confirming our next meeting time works for you...",
            date: "Mar 30, 2025",
            from: "Jordan Lee",
            unreadCount: 3,
            unread: true,
            type: "update",
        },
        {
            id: 4,
            subject: "Payment Received",
            preview: "Your tutoring payment has been processed.",
            date: "Apr 1, 2025",
            from: "Billing",
            unreadCount: 1,
            unread: true,
            type: "success",
        },
        {
            id: 7,
            subject: "Payment Received",
            preview: "Your tutoring payment has been processed.",
            date: "Apr 1, 2025",
            from: "Billing",
            unreadCount: 1,
            unread: true,
            type: "error",
        },
        {
            id: 5,
            subject: "Warning: Missed Session",
            preview: "You missed a session scheduled for April 1.",
            date: "Apr 1, 2025",
            from: "System",
            unreadCount: 1,
            unread: true,
            type: "warning",
        },
        {
            id: 6,
            subject: "Profile Update",
            preview: "Your profile has been updated successfully.",
            date: "Mar 28, 2025",
            from: "Support",
            unreadCount: 0,
            unread: false,
            type: "success",
        },
    ]);

    // Displays number of unread messages in a thread as a blue badge.
    // Resets to 0 (and hides the badge) when a thread is clicked/read.
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
        Calendar: "/tutor/calendar",
        Support: "/support",
        Profile: "/tutor/profile",
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
