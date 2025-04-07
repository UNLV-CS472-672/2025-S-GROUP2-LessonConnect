import React, {useState} from "react";
import ProgressWheel from "./ProgressWheel";
import "../Styles/StudentView.css";
import {Link} from "react-router-dom";
import StudentNavbar from "./StudentNavbar";

const dashboardOptions = [
    { text: "Find a tutor", img: "/assets/images/search_icon.png", path:"/student/findTutor"},
    { text: "Profile", img: "/assets/images/profile_icon.png", path:"/student/profile" },
    { text: "Pomodoro Timer", img: "/assets/images/pomodoro_icon.png", path:"/student/pomodoro" },
    { text: "Chat & Video with Tutor", img: "/assets/images/videochat_icon.png", path:"/student/messaging-video" },
    { text: "My Calendar", img: "/assets/images/calendar_icon.png", path:"/student/calendar" },
    { text: "My Assignments", img: "/assets/images/assignment_icon.png", path:"/student/assignment"},
    { text: "My Messages", img: "/assets/images/messages_icon.png", path:"/student/messages" },
    { text: "My Whiteboard", img: "/assets/images/whiteboard_icon.png", path:"/student/whiteboard" },
];

const externalLinks = [
    { text: "Go to my lessons", path:"/student/lessons" },
    { text: "Resource Center", path:"/student/resources" },
    { text: "Tutoring Support", path:"/student/support" },
    { text: "settings", path:"/student/settings" },
    { text: "contact us", path:"/student/contact" },
];

export default function StudentView({ darkMode, toggleTheme }) {
    return (
        <div className={`user-view-section-page ${darkMode ? "dark-mode" : ""}`}>
            <StudentNavbar isDarkMode={darkMode} toggleTheme={toggleTheme} />
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
                        <ProgressWheel progress={75} darkMode={darkMode} />
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
    );
}
