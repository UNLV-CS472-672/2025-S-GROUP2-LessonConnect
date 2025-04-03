import { useState, useRef, useEffect } from "react";
import "../Styles/Chat.css";

// TODO: Integrate axios and backend API calls when available

export default function Chat() {
    // ------------------- STATE --------------------
    const [messages, setMessages] = useState([
        {
            text: "Hey, can we discuss the project details?",
            type: "received",
            time: "11:01 AM",
            read: true,
        },
        {
            text: "Hi John, sure thing! Let me know what you need.",
            type: "sent",
            time: "11:02 AM",
            read: true,
        },
        {
            text: "I was wondering if we could add interactive elements to the presentation?",
            type: "received",
            time: "11:05 AM",
            read: false,
        },
    ]);

    const [inputText, setInputText] = useState("");

    const [chatList, /*setChatList*/] = useState([
        {
            id: 1,
            name: "John Smith",
            lastMessage: "Hey, can we discuss the project?",
            time: "11:01 AM",
            unreadCount: 2,
            avatar: "assets/images/coding.jpg",
            role: "Senior Tutor",
            status: "Online",
            email: "johnsmith@lessonconnect.com",
            joined: "Jan 2023",
            location: "New York, USA",
        },
        {
            id: 2,
            name: "Jane Doe",
            lastMessage: "Great job on the report!",
            time: "10:45 AM",
            unreadCount: 0,
            avatar: "assets/images/coding.jpg",
            role: "Tutor",
            status: "Offline",
            email: "janedoe@lessonconnect.com",
            joined: "Dec 2022",
            location: "Los Angeles, USA",
        },
        {
            id: 3,
            name: "Bob Williams",
            lastMessage: "Let's catch up later.",
            time: "9:30 AM",
            unreadCount: 1,
            avatar: "assets/images/coding.jpg",
            role: "Student",
            status: "Online",
            email: "bobwilliams@lessonconnect.com",
            joined: "Feb 2023",
            location: "Chicago, USA",
        },
    ]);

    // Track which chat is selected
    const [selectedChat, setSelectedChat] = useState(chatList[0]);

    // For toggling sidebars (UC2)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDetailsOpen, setIsDetailsOpen] = useState(true);

    // For searching chats (UC3)
    const [searchTerm, setSearchTerm] = useState("");

    // For auto-scrolling to bottom of the chat
    const chatBodyRef = useRef(null);

    // ------------------- EFFECTS --------------------
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    // ------------------- HELPERS --------------------
    // Format current time as "hh:mm AM/PM"
    function getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    // Send a message (UC5)
    function handleSend() {
        const text = inputText.trim();
        if (text === "") return;

        const newMessage = {
            text,
            type: "sent",
            time: getCurrentTime(),
            read: false, // We'll mark it as read once we simulate the reply
        };
        setMessages((prev) => [...prev, newMessage]);
        setInputText("");

        simulateReply();
    }

    // Simulate receiving a reply with a "typing" indicator (UC6 "read receipts" can be updated here)
    function simulateReply() {
        // TODO: Replace with axios call to backend when API is available
        const typingMessage = {
            text: "...",
            type: "received",
            time: "",
            isTyping: true,
            read: false,
        };
        setMessages((prev) => [...prev, typingMessage]);

        setTimeout(() => {
            setMessages((prev) => {
                // Remove the typing message
                const withoutTyping = prev.filter((msg) => !msg.isTyping);

                // Mark all sent messages as read
                const updated = withoutTyping.map((m) =>
                    m.type === "sent" ? { ...m, read: true } : m
                );

                // Add the actual reply
                return [
                    ...updated,
                    {
                        text: "This is a simulated reply.",
                        type: "received",
                        time: getCurrentTime(),
                        read: false,
                    },
                ];
            });
        }, 1000);
    }

    // Press "Enter" to send
    function handleKeyPress(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    }

    // Toggle the left sidebar
    function toggleSidebar() {
        setIsSidebarOpen(!isSidebarOpen);
    }

    // Toggle the right details panel
    function toggleDetails() {
        setIsDetailsOpen(!isDetailsOpen);
    }

    // Select a chat from the list (UC4)
    function handleSelectChat(chat) {
        setSelectedChat(chat);

        // TODO: Load messages for the selected chat from backend when available
        setMessages([
            {
                text: `Hi, this is ${chat.name}'s conversation. Feel free to start chatting!`,
                type: "received",
                time: getCurrentTime(),
                read: false,
            },
        ]);
    }

    // Filter chat list by search term
    const filteredChatList = chatList.filter((chat) =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ------------------- RENDER --------------------
    return (
        <div className="chat-page">
            {/* HEADER */}
            <header className="header">
                <div className="header-logo">
                    <h1>LessonConnect</h1>
                </div>
                <div className="header-search">
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search"></i>
                </div>
            </header>

            {/* MAIN CONTAINER */}
            <main className="container">
                {/* LEFT SIDEBAR (UC1: View Chat List) */}
                <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
                    <div className="sidebar-top">
                        <h2>Chats</h2>
                        <button
                            className="new-chat"
                            onClick={() => alert("Starting a new chat... (UC1, future scope)")}
                        >
                            <i className="fas fa-plus"></i> <span>New Chat</span>
                        </button>
                    </div>
                    <ul className="chat-list">
                        {filteredChatList.map((chat) => (
                            <li
                                key={chat.id}
                                className={`chat-item ${selectedChat.id === chat.id ? "active" : ""}`}
                                onClick={() => handleSelectChat(chat)}
                            >
                                <img src={chat.avatar} alt="User Avatar" className="avatar" />
                                <div className="chat-info">
                                    <h3>{chat.name}</h3>
                                    <p>{chat.lastMessage}</p>
                                </div>
                                <div className="chat-meta">
                                    <span className="time">{chat.time}</span>
                                    {chat.unreadCount > 0 && <span className="badge">{chat.unreadCount}</span>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* CHAT WINDOW */}
                <section className="chat-window">
                    {/* Chat Header */}
                    <div className="chat-header">
                        <div className="chat-with">
                            <button className="sidebar-toggle" onClick={toggleSidebar}>
                                <i className="fas fa-bars"></i>
                            </button>
                            <img src={selectedChat.avatar} alt="User Avatar" className="avatar" />
                            <div>
                                <h2>{selectedChat.name}</h2>
                                <p className="status">{selectedChat.status}</p>
                            </div>
                        </div>
                        <div className="chat-actions">
                            <button className="action-btn" onClick={() => alert("Video call!")}>
                                <i className="fas fa-video"></i>
                            </button>
                            <button className="action-btn" onClick={toggleDetails}>
                                <i className="fas fa-info-circle"></i>
                            </button>
                        </div>
                    </div>

                    {/* Chat Body */}
                    <div className="chat-body" ref={chatBodyRef}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.type} ${msg.isTyping ? "typing" : ""}`}
                            >
                                {/* For "received" messages, show an avatar if not typing */}
                                {msg.type === "received" && !msg.isTyping && (
                                    <img src={selectedChat.avatar} alt="Avatar" className="avatar" />
                                )}
                                <div className="message-content">
                                    <p>{msg.text}</p>
                                    {/* Show time if not typing */}
                                    {!msg.isTyping && (
                                        <span className="time">
                      {msg.time}
                                            {/* If it's a sent message, show a small read receipt check (UC6) */}
                                            {msg.type === "sent" && msg.read && (
                                                <i className="fas fa-check read-receipt" title="Message read"></i>
                                            )}
                    </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chat Input (UC5: Send Message) */}
                    {/* Chat Input Area with Fake Attach & Emoji Buttons */}
                    {/* This is the updated chat input area with Video & Upload on the right */}
                    <div className="chat-input-area">
                        {/* Left: Emoji Button */}
                        <button className="emoji-btn" onClick={() => alert("Emoji picker not implemented!")}>
                            🙂
                        </button>

                        {/* Center: Text Input */}
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />

                        {/* Right: Video, Upload, Send */}
                        <button className="video-btn" onClick={() => alert("Video call not implemented!")}>
                            🎥
                        </button>
                        <button className="upload-btn" onClick={() => alert("File upload not implemented!")}>
                            ⏏
                        </button>
                        <button className="send-btn" onClick={handleSend}>
                            Send
                        </button>
                    </div>
                </section>

                {/* RIGHT SIDEBAR (UC7: View Contact Info, UC8: Role-based Labeling, UC10: Status Indicator) */}
                <aside className={`details-sidebar ${isDetailsOpen ? "open" : "closed"}`}>
                    <div className="details-card">
                        <img src={selectedChat.avatar} alt="User Avatar" className="profile-avatar" />
                        <h3>{selectedChat.name}</h3>
                        <p className="role-label">{selectedChat.role}</p>
                    </div>
                    <div className="details-info">
                        <p>
                            <strong>Status:</strong> {selectedChat.status}
                        </p>
                        <p>
                            <strong>Email:</strong> {selectedChat.email}
                        </p>
                        <p>
                            <strong>Joined:</strong> {selectedChat.joined}
                        </p>
                        <p>
                            <strong>Location:</strong> {selectedChat.location}
                        </p>
                    </div>
                    <div className="details-actions">
                        {/* UC: Mute, Block, Report */}
                        <button onClick={() => alert("Muted user!")}>Mute</button>
                        <button onClick={() => alert("Blocked user!")}>Block</button>
                        <button onClick={() => alert("Reported user!")}>Report</button>
                    </div>
                </aside>
            </main>
        </div>
    );
}
