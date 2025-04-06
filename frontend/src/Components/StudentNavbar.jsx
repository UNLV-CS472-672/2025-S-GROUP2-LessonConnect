import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../Styles/StudentNavbar.css"; // You can keep using the same styles

export default function StudentNavbar({ isDarkMode, toggleTheme }) {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const toggleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    const closeDropdown = () => setOpenDropdown(null);
    const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);
    const closeProfileDropdown = () => setProfileDropdownOpen(false);

    // // Example of how to increment (you could use real-time data or API calls)
    // const incrementInboxCount = () => setInboxCount(inboxCount + 1);
    // const incrementNotificationCount = () => setNotificationCount(notificationCount + 1);

    return (
        <div className="student-navbar">
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
                        <div className="navbar-nav me-auto mb-2 mb-lg-0">
                            <NavLink to="/student/findTutor" className="nav-link">Find a tutor</NavLink>
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
                            <img src="/assets/images/mail.png" alt="Inbox" width="30" height="30" />
                        </NavLink>

                        <NavLink to="/notification" className="nav-link bell-icon">
                            <img src="/assets/images/bell.png" alt="Notification" width="30" height="30" />
                        </NavLink>

                        <div className="nav-item dropdown" onMouseLeave={closeProfileDropdown}>
                            <button className="nav-link profile-icon" onClick={toggleProfileDropdown} style={{ background: "transparent", border: "none", padding: 0 }}>
                                <img src="/assets/images/user.png" alt="Profile" width="50" height="50" className="rounded-circle" />
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
            {/*    /!* This was made to test the notifications and inbox (Uncomment when ready to use )*!/*/}
            {/*    /!*<button onClick={incrementInboxCount}>Simulate Inbox Notification</button>*!/*/}
            {/*    /!*<button onClick={incrementNotificationCount}>Simulate Notification</button>*!/*/}
        </div>

    );
}
