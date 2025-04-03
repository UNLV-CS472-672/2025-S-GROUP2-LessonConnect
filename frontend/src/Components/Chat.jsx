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

    // ------------------- RENDER --------------------
    return (
        <div>
            {/*start coding sooon just setting up*/}
        </div>
    );
}
