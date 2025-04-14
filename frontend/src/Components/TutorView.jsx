import { Link } from "react-router-dom";
import "../Styles/TutorView.css";
import PropTypes from "prop-types";
import StudentNavbar from "./StudentNavbar";

const dashboardOptions = [
    { text: "Manage Sessions", img: "/assets/images/UNLV_pic.png", path:"/tutor/findTutor"},
    { text: "Upload Assignments", img: "/assets/images/UNLV_pic.png", path:"/tutor/createAssignment" },
    { text: "Pomodoro", img: "/assets/images/UNLV_pic.png", path:"/tutor/pomodoro" },
    { text: "Messages", img: "/assets/images/UNLV_pic.png", path:"/tutor/inbox" },
    { text: "Availability", img: "/assets/images/UNLV_pic.png", path:"/tutor/availability" },
    { text: "Create Quiz", img: "/assets/images/UNLV_pic.png", path:"/tutor/createQuiz" },
    { text: "Gaming Stats", img: "/assets/images/UNLV_pic.png", path:"/tutor/gaming" },
    { text: "Profile", img: "/assets/images/UNLV_pic.png",path:"/tutor/profile" },
];

const sidebarOptions = [
    { text: "Resources", path:"/tutor/resources" },
    { text: "Settings", path:"/tutor/settings" },
    { text: "Calendar", path:"/tutor/calendar"},
    { text: "Student Requests", path:"/tutor/requests" },
    { text: "Post Announcements", path:"/tutor/announcements" },
    { text: "Sticker Book", path:"/tutor/sticker" }
];

export default function TutorView({ darkMode, toggleTheme }) {
    return (
        <div className={`tutor-dashboard-page ${darkMode ? "dark-mode" : ""}`}>
            <StudentNavbar isDarkMode={darkMode} toggleTheme={toggleTheme} />
            <section className="greeting">
                <div className="inner-container">
                    <h1 className="fade-in">👋 Welcome back, Jose!</h1>
                    <p className="subheading">Ready to help them level up today?</p>
                </div>
            </section>

            <section className="dashboard-section">
                <div className="inner-container dashboard-layout">
                    <div className="button-grid">
                        {dashboardOptions.map((option, index) => (
                            option.path ? (
                                <Link to={option.path} className="button-card" key={index}>
                                    <img src={option.img} alt={option.text} />
                                    <span>{option.text}</span>
                                </Link>
                            ) : (
                                <div className="button-card" key={index}>
                                    <img src={option.img} alt={option.text} />
                                    <span>{option.text}</span>
                                </div>
                            )
                        ))}
                    </div>

                    <div className="sidebar-buttons">
                        {sidebarOptions.map((option, index) => (
                            <Link key={index} to={option.path} className="sidebar-button-link">
                                <button>{option.text}</button>
                            </Link>
                        ))}

                    </div>
                </div>
            </section>

            <section className="quick-stats-section">
                <div className="inner-container stats-container">
                    <h2>📊 Quick Stats</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Sessions This Week</h3>
                            <p>12</p>
                        </div>
                        <div className="stat-card">
                            <h3>Missed Follow-Ups</h3>
                            <p>3</p>
                        </div>
                        <div className="stat-card">
                            <h3>Quizzes Reviewed</h3>
                            <p>8</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

TutorView.propTypes = {
    darkMode: PropTypes.bool.isRequired,
    toggleTheme: PropTypes.func.isRequired,
};
