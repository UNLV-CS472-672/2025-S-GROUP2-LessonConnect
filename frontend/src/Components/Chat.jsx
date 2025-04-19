import { useState, useRef, useEffect } from "react";
import "../Styles/Chat.css";
// import Calendar from "react-calendar";
// import EmojiPicker from "emoji-picker-react";


// TODO: Integrate axios and backend API calls when available
// https://medium.com/@rojin.dumre98/implementing-websockets-in-django-react-d114deac0abe

export default function Chat() {
    // ------------------- STATE --------------------
    // emoji-picker-react
    // const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    // function handleEmojiClick(emojiData) {
    //     setInputText(prev => prev + emojiData.emoji);
    // }


    const [inputText, setInputText] = useState("");

    const [chatList, /*setChatList*/] = useState([
        // TODO: Using GET, fetch the most recent message from sender in chat to render
        {
            id: 1,
            name: "John Smith",
            roomName: "John-Smith",
            lastMessage: "Hey, can we discuss the project?",
            time: "11:01 AM",
            unreadCount: 2,
            avatar: "/assets/images/coding.jpg",
            role: "Senior Tutor",
            status: "Online",
            email: "johnsmith@lessonconnect.com",
            joined: "Jan 2023",
            location: "New York, USA",
        },
        {
            id: 2,
            name: "Jane Doe",
            roomName: "Jane-Doe",
            lastMessage: "Great job on the report!",
            time: "10:45 AM",
            unreadCount: 0,
            avatar: "/assets/images/coding.jpg",
            role: "Tutor",
            status: "Offline",
            email: "janedoe@lessonconnect.com",
            joined: "Dec 2022",
            location: "Los Angeles, USA",
        },
        {
            id: 3,
            name: "Bob Williams",
            roomName: "Bob-Williams",
            lastMessage: "Let's catch up later.",
            time: "9:30 AM",
            unreadCount: 1,
            avatar: "/assets/images/coding.jpg",
            role: "Student",
            status: "Online",
            email: "bobwilliams@lessonconnect.com",
            joined: "Feb 2023",
            location: "Chicago, USA",
        },
    ]);

    // Track which chat is selected
    const [selectedChat, setSelectedChat] = useState(null);

    // For toggling sidebars (UC2)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDetailsOpen, setIsDetailsOpen] = useState(true);

    // For searching chats (UC3)
    const [searchTerm, setSearchTerm] = useState("");

    // For auto-scrolling to bottom of the chat
    const chatBodyRef = useRef(null);

    // ------------ WEBSOCKET RELATED VARIABLES START------------------

    // Create a websocket
    const socket = useRef(null);

    // Dynamically set the chat room when user clicks a chat
    const [roomName, setRoomName] = useState(null);
    const [isTyping, setIsTyping] = useState(false);


    // States + variable used for pop-ups
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [modalInputText, setModalInputText] = useState("");

    // Used to refetch or re-render messages
    const accessToken = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");

    // Message related variables
    // Used to store messages for rendering in the frontend
    const [messageMap, setMessageMap] = useState({})
    // Used to remember message order for the front end for rendering
    const [messageOrder, setMessageOrder] = useState([]);

    // Handles notifying others that user is typing
    const handleTyping = (e) => {
        setInputText(e.target.value)
        // Prepare typing data
        const typingStatus = {
            typing: true
        };
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify(typingStatus));
        } else {
            console.warn("WebSocket not open.");
        }
    }
    // https://dev.to/3mustard/create-a-typing-animation-in-react-17o0
    // typing animation component
    const Typing = () => (
        <div className="typing">
            <div className="typing__dot"></div>
            <div className="typing__dot"></div>
            <div className="typing__dot"></div>
        </div>
    )
    // ------------ WEBSOCKET RELATED VARIABLES END------------------


    // ---------------- HTTP REQUEST EFFECTS START ------------------
    // Calls GET request to populate messageMap (reason why this effect is before websocket's effect)
    useEffect(() => {
        if (roomName) {
            // TODO: When a chat room is selected (roomName changes),
            //       fetch existing messages for that room using the access token.
            //       Once the messages are fetched, update the local message map state
            //       so it can be used for showing messages in the UI

        }
    }, [roomName]);
    // ---------------- HTTP REQUEST EFFECTS END ------------------

    // ------------ WEBSOCKET EFFECTS START------------------

    // Notify others that user has stopped typing with delay
    useEffect(() => {
        // Prepare typing data
        const typingStatus = {
            typing: false
        };

        const typingTimer = setTimeout(() => {
            if (socket.current && socket.current.readyState === WebSocket.OPEN) {
                socket.current.send(JSON.stringify(typingStatus));
            } else {
                console.warn("WebSocket not open.");
            }
        }, 2000); // Stop typing after 2 seconds

        return () => clearTimeout(typingTimer);
    }, [inputText]);

    // Handle opening the WebSocket connection when roomName changes
    useEffect(() => {
        if (roomName && !socket.current) {
            socket.current = new WebSocket(`ws://127.0.0.1:8000/ws/apps/chat/${roomName}/`, ["chat", accessToken]);

            // Ensure socket is initialized before setting event handlers
            socket.current.onopen = () => {
                console.log("WebSocket connected to room:", socket.current);
                // Checks any unseen messages as seen
                if(Object.keys(messageMap).length !== 0){ // If there is no existing messages
                    const seenStatus = {
                        seen: true
                    };
                    socket.current.send(JSON.stringify(seenStatus));
                }
            };

            socket.current.onerror = (event) => {
                console.log("WebSocket error", event);
            };
            // Handle incoming messages
            socket.current.onmessage = (event) => {
                console.log("Socket message received: ", event.data);
                const eventData = JSON.parse(event.data);
                if(eventData.username){ //ensure a username exists
                    if('body' in eventData && eventData.message === "successful"){
                        setIsTyping(false)
                        messageDisplay(eventData)
                    }
                    else if ('typing' in eventData && eventData.username !== username && eventData.message === "successful"){
                        setIsTyping(eventData.typing)
                    }
                    else if (eventData.message === "seen_successful" && eventData.username === username) {
                        // Assume eventData.ids is an array of message IDs that should be marked as seen
                        setMessageMap(prev => {
                            // Create a new state object with the updated 'seen' status for these messages
                            const updatedMessages = { ...prev };

                            // Loop over each message ID in eventData.ids and update its 'seen' status
                            eventData.ids.forEach(id => {
                                if (updatedMessages[id]) {
                                    updatedMessages[id] = {
                                        ...updatedMessages[id],
                                        seen: true,  // Mark the message as seen
                                    };
                                }
                            });

                            return updatedMessages;
                        });
                    }
                }
            };
            socket.current.onclose = (event) => {
                console.log("WebSocket closed", event);
            };
        }
        // Cleanup function to close the socket when the component unmounts or roomName changes
        return () => {
            if (socket.current) {
                socket.current.onmessage = null;
                socket.current.close(); // Close the WebSocket connection on cleanup
                socket.current = null; // Reset the socket reference
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomName, accessToken]);

    // ------------ WEBSOCKET EFFECTS END------------------

    // ------------------- EFFECTS --------------------
    useEffect(() => {
        const chat = chatBodyRef.current;
        if(!chat) return;
        const shouldScroll =
            chat.scrollTop + chat.clientHeight >= chat.scrollHeight - 100;

        if (shouldScroll) {
            chat.scrollTop = chat.scrollHeight;
        }
    }, [messageOrder, isTyping]);
    // ------------------- HELPERS --------------------

    function messageDisplay(eventData){
        let newMessage = {};
        if (eventData.username === username) {
            newMessage = {
                text: eventData.body,
                type: "sent",
                time: getCurrentTime(eventData.timestamp),
                message_id: eventData.id,
                seen: false
            }
        }
        else{
            newMessage = {
                text: eventData.body,
                type: "received",
                time: getCurrentTime(eventData.timestamp),
                message_id: eventData.id,
                seen: false
            }
            const seenStatus = {
                seen: true
            };
            // Send the seen status via WebSocket if the connection is open
            if (socket.current && socket.current.readyState === WebSocket.OPEN) {
                socket.current.send(JSON.stringify(seenStatus));
            } else {
                console.warn("WebSocket not open.");
            }
        }

        setMessageMap(prev => ({...prev, [newMessage.message_id]: newMessage,}));
        setMessageOrder((prev) => [...prev, newMessage.message_id]);
    }
    // Format current time as "hh:mm AM/PM"
    function getCurrentTime(timestamp) {
        // Convert the timestamp string to a JavaScript Date object
        const date = new Date(timestamp.replace(' ', 'T'));
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    // Send a message (UC5)
    function handleSend() {
        const text = inputText.trim();
        if (text === "") return;

        // Prepare message data for sending
        const messageData = {
            message: text
        };

        // Clear the input after sending the message
        setInputText("");

        // Send the message via WebSocket if the connection is open
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify(messageData));
        } else {
            console.warn("WebSocket not open.");
        }
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
        setRoomName(chat.roomName)
        setSelectedChat(chat);
    }

    // Creates a new chat
    function handleCreateChat() {
        const text = modalInputText.trim();
        if (text === "") return;
        // TODO: Connect with backend via POST to allow a new chat to be made
        alert("Starting a new chat... (UC1, future scope)")
        setModalInputText("")
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
                            //onClick={() => alert("Starting a new chat... (UC1, future scope)")}
                            onClick={() => setShowCreateModal(true)}
                        >
                            <i className="fas fa-plus"></i> <span>New Chat</span>
                        </button>
                    </div>
                    <ul className="chat-list">
                        {filteredChatList.map((chat) => (
                            <li
                                key={chat.id}
                                className={`chat-item ${selectedChat?.id === chat.id ? "active" : ""}`}
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
                {/* ====== Modal for Creating Chats ====== */}
                {showCreateModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            {/* Close Modal (×) Button - absolute top right */}
                            <button className="close-modal-btn" onClick={() => setShowCreateModal(false)}>
                                ×
                            </button>
                            {/* Text Input */}
                            <input
                                type="text"
                                placeholder="Add user to new chat..."
                                value={modalInputText}
                                onChange={(e) => setModalInputText(e.target.value)}
                                style={{ width: '200px', height: '30px', fontSize: '14px' }}
                            />
                            <div className="confirm-btn-wrapper">
                                <button className="confirm-btn" disabled={!modalInputText} onClick={handleCreateChat}>
                                        Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {selectedChat ? (
                    <>
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
                                {messageOrder.map((id) => {
                                    const msg = messageMap[id];
                                    if (!msg) return null; // just in case something isn't loaded yet

                                    return (
                                        <div key={id} className={`message ${msg.type}`}>
                                            {msg.type === "received" && (
                                                <img src={selectedChat.avatar} alt="Avatar" className="avatar" />
                                            )}
                                            <div className="message-content">
                                                <p>{msg.text}</p>
                                                <span className="time"> {msg.time}
                                                    {msg.type === "sent" && msg.seen && (
                                                        <i className="fas fa-check read-receipt" title="Message read"></i>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Show typing indicator at the bottom if someone is typing */}
                                {isTyping && <Typing />}
                            </div>

                            {/* Chat Input (UC5: Send Message) */}
                            {/* Chat Input Area with Fake Attach & Emoji Buttons */}
                            {/* This is the updated chat input area with Video & Upload on the right */}
                            <div className="chat-input-area">
                                {/* Left: Emoji Button */}
                                <button
                                    className="emoji-btn"
                                    // onClick={() => setShowEmojiPicker(prev => !prev)}
                                >
                                    🙂
                                </button>
                                {/*/!* Render Emoji Picker when showEmojiPicker is true *!/*/}
                                {/*{showEmojiPicker && (*/}
                                {/*    <div className="emoji-picker-container">*/}
                                {/*        <EmojiPicker onEmojiClick={handleEmojiClick} />*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                {/* Center: Text Input */}
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={inputText}
                                    onChange={handleTyping}
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
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <p>Please select a chat to start messaging.</p>
                        {/* Optional: add an icon or illustration here for better UX */}
                    </div>
                )}
            </main>
        </div>
    );
}
