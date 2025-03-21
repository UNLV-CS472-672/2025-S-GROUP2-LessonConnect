import {useState} from "react";
import "../Styles/Chat.css";
import userIcon from "/assets/images/UNLV_pic.png"; // Placeholder user icon
import botIcon from "/assets/images/UNLV_pic.png"; // Placeholder bot icon

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (input.trim() === "") return; // Prevent sending empty messages

        const newMessages = [...messages, { text: input }];
        setMessages(newMessages);
        setInput(""); // Clear input after sending

        // Simulate a bot response after a short delay
        // Should be coming from other side, future fix
        setTimeout(() => {
            setMessages([...newMessages, { text: "This is an automated response." }]);
        }, 250);
    };
    // Allows to press Enter key to send message
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevents new line in input
            sendMessage();
        }
    };

    return (
      <>
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
                <div className="chat-box">
                    <div className="chat-header">
                        <img src={botIcon} alt="Bot Icon" className="user-icon" />
                        <span className="user-name">Tutor</span>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className="message-container">
                                <div className="chat-bubble">{msg.text}</div>
                                <img src={userIcon} alt="User Icon" className="message-icon" />
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
      </>
    );
}
export default Chat;
