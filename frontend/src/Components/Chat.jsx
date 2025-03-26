import {useState} from "react";
import "../Styles/Chat.css";
import userIcon from "/assets/images/UNLV_pic.png"; // Placeholder user icon
import botIcon from "/assets/images/UNLV_pic.png"; // Placeholder bot icon

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [buttonClicked, setButtonClicked] = useState("");

    const sendMessage = () => {
        if (input.trim() === "") return; // Prevent sending empty messages

        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);
        setInput(""); // Clear input after sending

        // Simulate a bot response after a short delay
        // Should be coming from other side, future fix
        setTimeout(() => {
            setMessages([...newMessages, { text: "This is an automated response." , sender: "bot" }]);
        }, 250);
    };
    // Allows to press Enter key to send message
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevents new line in input
            sendMessage();
        }
    };
    const handleButtonClick = (buttonType) => {
        setButtonClicked(buttonType);
        console.log(`Button clicked: ${buttonType}`);
        // You can add more functionality here if needed
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
                <div className="button-bar">
                    <button onClick={() => handleButtonClick("Help")}>Button 1</button>
                    <button onClick={() => handleButtonClick("Help")}>Button 2</button>
                    <button onClick={() => handleButtonClick("Help")}>Button 3</button>
                    <button onClick={() => handleButtonClick("Help")}>Button 4</button>
                </div>
                <div className="chat-box">
                    <div className="chat-header">
                        <img src={botIcon} alt="Bot Icon" className="user-icon" />
                        <span className="user-name">Tutor</span>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-container ${msg.sender === "bot" ? "bot-message" : "user-message"}`}>
                                {msg.sender === "bot" && <img src={botIcon} alt="Bot Icon" className="message-icon" />}
                                <div className={`chat-bubble ${msg.sender === "bot" ? "bot-bubble" : "user-bubble"}`}>
                                    {msg.text}
                                </div>
                                {msg.sender === "user" && <img src={userIcon} alt="User Icon" className="message-icon" />}
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
