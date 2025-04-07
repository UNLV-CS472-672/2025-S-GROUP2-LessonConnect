import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../Styles/TutorView.css";

const dashboardOptions = [
    { text: "Manage Sessions", img: "/assets/images/UNLV_pic.png" },
    { text: "Upload Assignments", img: "/assets/images/UNLV_pic.png" },
    { text: "Student Progress", img: "/assets/images/UNLV_pic.png" },
    { text: "Messages", img: "/assets/images/UNLV_pic.png", path: "/inbox" },
    { text: "Availability", img: "/assets/images/UNLV_pic.png", path: "/calendar" },
    { text: "Create Quiz", img: "/assets/images/UNLV_pic.png" },
    { text: "Session Notes", img: "/assets/images/UNLV_pic.png" },
    { text: "Profile", img: "/assets/images/UNLV_pic.png", path: "/profile" },
];

const sidebarOptions = [
    { text: "Resources", path: "/resources" },
    { text: "Settings", path: "/settings" },
    { text: "Calendar", path: "/calendar" },
    { text: "Student Requests", path: "/requests" },
    { text: "Post Announcements", path: "/announcements" },
    { text: "Sticker Book", path: "/stickers" }
];

export default function TutorView() {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const toggleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    const closeDropdown = () => {
        setOpenDropdown(null);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    const closeProfileDropdown = () => {
        setProfileDropdownOpen(false);
    };

    return (
        <div className={`tutor-dashboard-page ${isDarkMode ? "dark-mode" : ""}`}>
            <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                <div className="container">
                    <Link to="/" className="navbar-brand d-flex align-items-center">
                        <i className="bi bi-house-door"></i>
                        <span className="ms-2">LessonConnect</span>
                    </Link>

                    <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav-collapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div id="nav-collapse" className="collapse navbar-collapse">
                        <div className="navbar-nav me-auto">
                            <NavLink to="/findTutor" className="nav-link">Find a tutor</NavLink>
                            <NavLink to="/services" className="nav-link">Services</NavLink>

                            <div className="nav-item dropdown" onMouseLeave={closeDropdown}>
                                <button className="nav-link dropdown-toggle" onClick={() => toggleDropdown("support")}>
                                    Support
                                </button>
                                <div className={`dropdown-menu ${openDropdown === "support" ? "show" : ""}`}>
                                    <NavLink to="/about" className="dropdown-item">About Us</NavLink>
                                    <NavLink to="/contact" className="dropdown-item">Contact Us</NavLink>
                                    <NavLink to="/faqs" className="dropdown-item">FAQS</NavLink>
                                </div>
                            </div>

                            <div className="nav-item dropdown" onMouseLeave={closeDropdown}>
                                <button className="nav-link dropdown-toggle" onClick={() => toggleDropdown("more")}>
                                    More
                                </button>
                                <div className={`dropdown-menu ${openDropdown === "more" ? "show" : ""}`}>
                                    <NavLink to="/learn_more" className="dropdown-item">Learn More</NavLink>
                                    <NavLink to="/resources" className="dropdown-item">Resources</NavLink>
                                    <NavLink to="/pomodoro" className="dropdown-item">Pomodoro</NavLink>
                                </div>
                            </div>
                        </div>

                        <button className="theme-toggle-button" onClick={toggleTheme}>
                            {isDarkMode ? "Light Theme" : "Dark Theme"}
                        </button>

                        <NavLink to="/inbox" className="nav-link inbox-icon">
                            <img src="/assets/images/mail.png" alt="Inbox" />
                        </NavLink>

                        <NavLink to="/notification" className="nav-link bell-icon">
                            <img src="/assets/images/bell.png" alt="Notifications" />
                        </NavLink>

                        <div className="nav-item dropdown" onMouseLeave={closeProfileDropdown}>
                            <button className="nav-link profile-icon" onClick={toggleProfileDropdown}>
                                <img src="/assets/images/user.png" alt="Profile" />
                            </button>
                            {profileDropdownOpen && (
                                <div className="dropdown-menu dropdown-menu-end show">
                                    <NavLink to="/profile" className="dropdown-item">My Profile</NavLink>
                                    <NavLink to="/settings" className="dropdown-item">Settings</NavLink>
                                    <NavLink to="/logout" className="dropdown-item">Logout</NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

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
