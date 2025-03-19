import {useState} from "react";
import "../Styles/Chat.css";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input }]);
            setInput("");
        }
    };


    return (
        <>
            <div className="chat-container">
                <div className="chat-box">
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className="chat-bubble">
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            className="input-field"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button className="send-button" onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Chat;