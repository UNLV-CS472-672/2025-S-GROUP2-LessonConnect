import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import ProgressWheel from "./ProgressWheel";
import StudentNavbar from "./StudentNavbar";
import Questionnaire from "./Questionnaire";
import "../Styles/StudentView.css";


const dashboardOptions = [
    { text: "Find a tutor", img: "/assets/images/search_icon.png", path: "/student/findTutor" },
    { text: "Profile", img: "/assets/images/profile_icon.png", path: "/student/profile" },
    { text: "Pomodoro Timer", img: "/assets/images/pomodoro_icon.png", path: "/student/pomodoro" },
    { text: "Chat & Video with Tutor", img: "/assets/images/videochat_icon.png", path: "/student/chat" },
    { text: "My Calendar", img: "/assets/images/calendar_icon.png", path: "/student/calendar" },
    { text: "My Assignments", img: "/assets/images/assignment_icon.png", path: "/student/assignment" },
    { text: "My Messages", img: "/assets/images/messages_icon.png", path: "/student/messages" },
    { text: "My Whiteboard", img: "/assets/images/whiteboard_icon.png", path: "/student/LandingPage" },
];


const externalLinks = [
    { text: "Go to my files", path: "/student/assignment?tab=files" },
    { text: "Gaming Stats", path: "/student/view#gaming" },
    { text: "Support", path: "/student/support" },
    { text: "settings", path: "/student/settings" },
    { text: "contact us", path: "/student/contact" },
];


export default function StudentView({ darkMode, toggleTheme }) {
    const location = useLocation();
    const [showQuestionnaire, setShowQuestionnaire] = useState(() => {
        return !localStorage.getItem("questionnaireCompleted");
    });


    useEffect(() => {
        if (location.hash) {
            setTimeout(() => {
                const el = document.querySelector(location.hash);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 0);
        }
    }, [location.hash]);


    return (
        <div className={`user-view-section-page ${darkMode ? "dark-mode" : ""}`}>
            <StudentNavbar isDarkMode={darkMode} toggleTheme={toggleTheme} />


            {showQuestionnaire && (
                <div className="questionnaire-overlay">
                    <div className="overlay-backdrop" />
                    <div className="overlay-content">
                        <Questionnaire
                            userRole={3}
                            onComplete={() => {
                                localStorage.setItem("questionnaireCompleted", "true");
                                setShowQuestionnaire(false);
                            }}
                        />
                    </div>
                </div>
            )}


            <section className="greeting">
                <div className="inner-container">
                    <h1 className="fade-in">👋 Welcome back!</h1>
                    <p>Ready to level up your skills today?</p>
                </div>
            </section>


            <section className="dashboard-section">
                <div className="inner-container dashboard-layout">
                    <div className="button-grid">
                        {dashboardOptions.map((option, index) => (
                            <Link to={option.path} className="button-card" key={index}>
                                <img src={option.img} alt={option.text} />
                                <span>{option.text}</span>
                            </Link>
                        ))}
                    </div>


                    <div className="vertical-button-container">
                        {externalLinks.map((link, index) =>
                            link.text === "Gaming Stats" ? (
                                <Link
                                    key={index}
                                    to={link.path}
                                    className="vertical-button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const el = document.querySelector("#gaming");
                                        if (el) {
                                            el.scrollIntoView({ behavior: "smooth", block: "start" });
                                            window.history.replaceState(null, "", link.path);
                                        }
                                    }}
                                >
                                    {link.text}
                                </Link>
                            ) : (
                                <Link key={index} to={link.path} className="vertical-button">
                                    {link.text}
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </section>


            {/* Gaming Section */}
            <section id="gaming" className="gaming-section">
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


StudentView.propTypes = {
    darkMode: PropTypes.bool.isRequired,
    toggleTheme: PropTypes.func.isRequired,
};
