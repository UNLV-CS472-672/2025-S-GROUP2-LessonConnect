import React from "react";
import "../Styles/StudentView.css";


const dashboardOptions = [
    { text: "Find a tutor", img: "/assets/images/search_icon.png" },
    { text: "Profile", img: "/assets/images/profile_icon.png" },
    { text: "Pomodoro Timer", img: "/assets/images/pomodoro_icon.png" },
    { text: "Chat & Video with Tutor", img: "/assets/images/videochat_icon.png" },
    { text: "My Calendar", img: "/assets/images/calendar_icon.png" },
    { text: "My Assignments", img: "/assets/images/assignment_icon.png" },
    { text: "My Messages", img: "/assets/images/messages_icon.png" },
    { text: "My Whiteboard", img: "/assets/images/whiteboard_icon.png" },
];

const externalLinks = [
    { text: "Go to my lessons", url: "https://example.com/resources" },
    { text: "Resource Center", url: "https://example.com/handbook" },
    { text: "Tutoring Support", url: "https://example.com/tutoring" },
    { text: "settings", url: "https://example.com/forum" },
    { text: "contact us", url: "https://example.com/settings" },
];



export default function StudentView() {
    return (
        <div className="user-view-section-page">
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
                            <div className="button-card" key={index}>
                                <img src={option.img} alt={option.text} />
                                <span>{option.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="vertical-button-container">
                        {externalLinks.map((link, index) => (
                            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="vertical-button">
                                {link.text}
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
