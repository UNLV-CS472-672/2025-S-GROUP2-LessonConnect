// Modified og code with AI Code for testing backend :D
import { useState, useEffect } from "react";
import "../Styles/Chat.css";
import userIcon from "/assets/images/UNLV_pic.png"; // Placeholder user icon

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [socket, setSocket] = useState(null);

    // Establish WebSocket connection on mount
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/apps/chat/testroom/"); // Change URL to match your WebSocket route
        setSocket(ws);

        ws.onopen = () => {
            console.log("Connected to WebSocket");
        };

        // Listen for messages from the WebSocket (other users)
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.message) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: data.message, sender: "other" },
                ]);
            }
        };

        ws.onclose = () => {
            console.log("Disconnected from WebSocket");
        };

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = () => {
        if (input.trim() === "" || !socket) return; // Prevent sending empty messages or if WebSocket is not connected

        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);
        setInput(""); // Clear input after sending

        // Send message to WebSocket backend
        socket.send(JSON.stringify({ message: input }));
    };

    // Allows pressing Enter key to send message
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevents new line in input
            sendMessage();
        }
    };

    return (
        <>
            <div className="chat-page-layout">
                <div className="chat-layout">
                    {/* Side Panel */}
                    <div className="side-panel">
                        <h2>Menu</h2>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/profile">Profile</a></li>
                            <li><a href="/settings">Settings</a></li>
                            <li><a href="/Whiteboard">Whiteboard</a></li>
                        </ul>
                    </div>

                    {/* Chat Section */}
                    <div className="chat-container">
                        <div className="button-bar">
                            <button>Button 1</button>
                            <button>Button 2</button>
                            <button>Button 3</button>
                            <button>Button 4</button>
                        </div>
                        <div className="chat-box">
                            <div className="chat-header">
                                <img src={userIcon} alt="User Icon" className="user-icon" />
                                <span className="user-name">You</span>
                            </div>
                            <div className="chat-messages">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`message-container ${msg.sender === "user" ? "user-message" : "other-message"}`}>
                                        {msg.sender === "user" && <img src={userIcon} alt="User Icon" className="message-icon" />}
                                        <div className={`chat-bubble ${msg.sender === "user" ? "user-bubble" : "other-bubble"}`}>
                                            {msg.text}
                                        </div>
                                        {msg.sender !== "user" && <img src={userIcon} alt="User Icon" className="message-icon" />}
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input">
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Type a message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                                <button className="send-button" onClick={sendMessage}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chat;
