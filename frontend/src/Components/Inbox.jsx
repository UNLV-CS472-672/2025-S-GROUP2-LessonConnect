
import { useState } from "react";
import "../Styles/Inbox.css";

export default function Inbox() {
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [activeNav, setActiveNav] = useState("Inbox");

    const [messages, setMessages] = useState([
        {
            id: 1,
            subject: "New Tutoring Request",
            preview: "Hi there! I'm looking for help with algebra...",
            date: "Apr 4, 2025",
            from: "Alex Morgan",
            unreadCount: 1,
            unread: true,
        },
        {
            id: 2,
            subject: "Follow-up on Geometry Session",
            preview: "Thanks for yesterday’s session. I had a question about...",
            date: "Apr 2, 2025",
            from: "Taylor Brooks",
            unreadCount: 0,
            unread: false,
        },
        {
            id: 3,
            subject: "Schedule Confirmation",
            preview: "Just confirming our next meeting time works for you...",
            date: "Mar 30, 2025",
            from: "Jordan Lee",
            unreadCount: 2,
            unread: true,
        },
    ]);

    const handleSelectMessage = (msg) => {
        setSelectedMessage(msg);
        setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, unread: false } : m))
        );
    };

    return (
        <div className="inbox-app">
            {/* 🔺 HEADER BAR */}
            <header className="inbox-header">
                <div className="logo">🏠 <span>LessonConnect</span></div>
                <nav className="header-nav">
                    <a href="#">Find a tutor</a>
                    <a href="#">Services</a>
                    <a href="#">Support</a>
                    <a href="#">More</a>
                    <button className="login-btn">Login</button>
                </nav>
            </header>

            {/* 🔻 MAIN CONTENT */}
            <div className="inbox-page-container">
                <div className="inbox-side-menu">
                    <ul>
                        {["Inbox", "Calendar", "Support"].map((item) => (
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
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="inbox-thread-list">
                    <div className="inbox-toolbar">
                        <select>
                            <option>All Subjects</option>
                        </select>
                        <select>
                            <option>Inbox</option>
                        </select>
                        <input type="text" placeholder="Search..." />
                    </div>

                    <div className="thread-label">Notifications</div>

                    <ul className="message-threads">
                        {messages.map((msg) => (
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
    );
}
