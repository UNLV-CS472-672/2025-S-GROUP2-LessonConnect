import React, {useState} from "react";
import ProgressWheel from "./ProgressWheel";
import "../Styles/StudentView.css";
import {Link, NavLink} from "react-router-dom";
import StudentNavbar from "./StudentNavbar"; // ⬅️ add this

const dashboardOptions = [
    { text: "Find a tutor", img: "/assets/images/search_icon.png", path:"/student/findTutor"},
    { text: "Profile", img: "/assets/images/profile_icon.png", path:"/profile" },
    { text: "Pomodoro Timer", img: "/assets/images/pomodoro_icon.png", path:"/pomodoro" },
    { text: "Chat & Video with Tutor", img: "/assets/images/videochat_icon.png", path:"/messaging-video" },
    { text: "My Calendar", img: "/assets/images/calendar_icon.png", path:"/calendar" },
    { text: "My Assignments", img: "/assets/images/assignment_icon.png", path:"/assignment"},
    { text: "My Messages", img: "/assets/images/messages_icon.png", path:"/messages" },
    { text: "My Whiteboard", img: "/assets/images/whiteboard_icon.png", path:"/whiteboard" },
];

const externalLinks = [
    { text: "Go to my lessons", path:"/lessons" },
    { text: "Resource Center", path:"/resources" },
    { text: "Tutoring Support", path:"/support" },
    { text: "settings", path:"/settings" },
    { text: "contact us", path:"/contact" },
];

export default function StudentView() {

    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="user-view-section-page">
            <StudentNavbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> 
            <div className={`user-view-section-page ${isDarkMode ? "dark-mode" : ""}`}>
                <section className="greeting">
                    <div className="inner-container">
                        <h1 className="fade-in">👋 Welcome back, Franklin!</h1>
                        <p>Ready to level up your skills today?</p>
                    </div>
                </section>


                <section className="dashboard-section">
                    <div className="inner-container dashboard-layout">
                        {/* Dashboard Grid */}
                        <div className="button-grid">
                            {dashboardOptions.map((option, index) => (
                                <Link to={option.path} className="button-card" key={index}>
                                    <img src={option.img} alt={option.text} />
                                    <span>{option.text}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="vertical-button-container">
                            {externalLinks.map((link, index) => (
                                <Link key={index} to={link.path} className="vertical-button">
                                    {link.text}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Gaming Section */}
                <section className="gaming-section">
                    <div className="inner-container">
                        <h2>Gaming Stats</h2>
                        <ProgressWheel progress={75} darkMode={isDarkMode} />
                    </div>
                </section>

                {/* Badge Section */}
                <section className="badge-section">
                    <div className="badge-item">🥇 Pomodoro Master</div>
                    <div className="badge-item">📚 Lesson Expert</div>
                    <div className="badge-item">🧠 Quiz Wizard</div>
                    <div className="badge-item">📜 Submission Champ</div>
                    <div className="badge-item">⚡ Speedster</div>
                </section>

            </div>
        </div>
    );
}
