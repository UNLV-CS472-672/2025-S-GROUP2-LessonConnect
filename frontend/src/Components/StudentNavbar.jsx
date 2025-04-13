import { useState } from "react";
import {Link, NavLink, useLocation} from "react-router-dom";
import PropTypes from "prop-types";
import "../Styles/StudentNavbar.css";

export default function StudentNavbar({ isDarkMode, toggleTheme, role}) {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const toggleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    const location = useLocation();
    const pathRole = location.pathname.split("/")[1];
    const safeRole = role || (pathRole === "tutor" ? "tutor" : "student");    const closeDropdown = () => setOpenDropdown(null);
    const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);
    const closeProfileDropdown = () => setProfileDropdownOpen(false);

    // // Example of how to increment (you could use real-time data or API calls)
    // const incrementInboxCount = () => setInboxCount(inboxCount + 1);
    // const incrementNotificationCount = () => setNotificationCount(notificationCount + 1);

    return (
        <div className="student-navbar">
            <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                <div className="container">
                    <Link to={`/${safeRole}/view`} className="navbar-brand d-flex align-items-center">
                        <i className="bi bi-house-door"></i>
                        <span className="ms-2">LessonConnect</span>
                    </Link>

                    <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav-collapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div id="nav-collapse" className="collapse navbar-collapse">
                        <div className="navbar-nav me-auto mb-2 mb-lg-0">
                            <NavLink to={`/${safeRole}/findTutor`} className="nav-link">Find a tutor</NavLink>
                            <NavLink to={`/${safeRole}/services`} className="nav-link">Services</NavLink>

                            <div className="nav-item dropdown" onMouseLeave={closeDropdown}>
                                <button className="nav-link dropdown-toggle" onClick={() => toggleDropdown("support")}>
                                    Support
                                </button>
                                <div className={`dropdown-menu ${openDropdown === "support" ? "show" : ""}`}>
                                    <NavLink to={`/${safeRole}/about`} className="dropdown-item">About Us</NavLink>
                                    <NavLink to={`/${safeRole}/contact`} className="dropdown-item">Contact Us</NavLink>
                                    <NavLink to={`/${safeRole}/faqs`} className="dropdown-item">FAQS</NavLink>
                                </div>
                            </div>

                            <div className="nav-item dropdown" onMouseLeave={closeDropdown}>
                                <button className="nav-link dropdown-toggle" onClick={() => toggleDropdown("more")}>
                                    More
                                </button>
                                <div className={`dropdown-menu ${openDropdown === "more" ? "show" : ""}`}>
                                    <NavLink to={`/${safeRole}/learn_more`} className="dropdown-item">Learn More</NavLink>
                                    <NavLink to={`/${safeRole}/resources`} className="dropdown-item">Resources</NavLink>
                                    <NavLink to={`/${safeRole}/pomodoro`} className="dropdown-item">Pomodoro</NavLink>
                                </div>
                            </div>
                        </div>

                        <button className="theme-toggle-button" onClick={toggleTheme}>
                            {isDarkMode ? "Light Theme" : "Dark Theme"}
                        </button>

                        <NavLink to={`/${safeRole}/inbox`} className="nav-link inbox-icon">
                            <img src="/assets/images/mail.png" alt="Inbox" width="30" height="30" />
                        </NavLink>

                        <NavLink to={`/${safeRole}/notification`} className="nav-link bell-icon">
                            <img src="/assets/images/bell.png" alt="Notification" width="30" height="30" />
                        </NavLink>

                        <div className="nav-item dropdown" onMouseLeave={closeProfileDropdown}>
                            <button className="nav-link profile-icon" onClick={toggleProfileDropdown} style={{ background: "transparent", border: "none", padding: 0 }}>
                                <img src="/assets/images/user.png" alt="Profile" width="50" height="50" className="rounded-circle" />
                            </button>
                            {profileDropdownOpen && (
                                <div className="dropdown-menu dropdown-menu-end show">
                                    <NavLink to={`/${safeRole}/profile`} className="dropdown-item">My Profile</NavLink>
                                    <NavLink to={`/${safeRole}/settings`} className="dropdown-item">Settings</NavLink>
                                    <NavLink to={`/${safeRole}/logout`} className="dropdown-item">Logout</NavLink>
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

StudentNavbar.propTypes = {
    isDarkMode: PropTypes.bool.isRequired,
    toggleTheme: PropTypes.func.isRequired,
};
