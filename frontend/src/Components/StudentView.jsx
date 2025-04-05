import React from "react";
import "../Styles/StudentView.css";


const dashboardOptions = [
    { text: "Schedule an Appointment", img: "/assets/images/UNLV_pic.png" },
    { text: "Profile", img: "/assets/images/UNLV_pic.png" },
    { text: "Pomodoro Timer", img: "/assets/images/UNLV_pic.png" },
    { text: "Chat & Video with Tutor", img: "/assets/images/UNLV_pic.png" },
    { text: "My Calendar", img: "/assets/images/UNLV_pic.png" },
    { text: "My Assignments", img: "/assets/images/UNLV_pic.png" },
    { text: "My Messages", img: "/assets/images/UNLV_pic.png" },
    { text: "My Whiteboard", img: "/assets/images/UNLV_pic.png" },
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
                </div>
            </section>
        </div>
    );
}
