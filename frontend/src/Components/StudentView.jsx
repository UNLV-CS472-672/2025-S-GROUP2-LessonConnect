import React, {useState} from "react";
import "../Styles/StudentView.css";
import {Link, NavLink} from "react-router-dom";


const dashboardOptions = [
    { text: "Find a tutor", img: "/assets/images/search_icon.png", path:"/findTutor"},
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

    const [openDropdown, setOpenDropdown] = useState(null);

    // Toggle dropdown open/close
    const toggleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    // Close dropdown when mouse leaves the dropdown area
    const closeDropdown = () => {
        setOpenDropdown(null);
    };

    // State for notification counts (uncomment when ready to use)
    // const [inboxCount, setInboxCount] = useState(0);
    // const [notificationCount, setNotificationCount] = useState(0);
    //
    // // Example of how to increment (you could use real-time data or API calls)
    // const incrementInboxCount = () => setInboxCount(inboxCount + 1);
    // const incrementNotificationCount = () => setNotificationCount(notificationCount + 1);

    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    const closeProfileDropdown = () => {
        setProfileDropdownOpen(false);
    };

    return (
        <div className="user-view-section-page">
            <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                <div className="container">
                    {/* Home Icon + LessonConnect */}
                    <Link to="/" className="navbar-brand d-flex align-items-center">
                        <i className="bi bi-house-door"></i>
                        <span className="ms-2">LessonConnect</span>
                    </Link>

                    <button
                        className="navbar-toggler"
                        data-bs-toggle="collapse"
                        data-bs-target="#nav-collapse"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div id="nav-collapse" className="collapse navbar-collapse">
                        <div className="navbar-nav me-auto mb-2 mb-lg-0">
                            <NavLink to="/findTutor" className="nav-link">Find a tutor</NavLink>
                            <NavLink to="/services" className="nav-link">Services</NavLink>

                            {/* Support Dropdown */}
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

                            {/* More Dropdown */}
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
                        {/* Inbox Icon */}
                        <NavLink to="/inbox" className="nav-link inbox-icon">
                            <img src="/assets/images/mail.png" alt="Inbox" width="30" height="30" />
                            {/*{inboxCount > 0 && <span className="notification-count">{inboxCount}</span>} (uncomment when ready to use )*/}
                        </NavLink>

                        {/* Notification Icon */}
                        <NavLink to="/notification" className="nav-link bell-icon">
                            <img src="/assets/images/bell.png" alt="Notification"  width="30" height="30" />
                            {/*{notificationCount > 0 && <span className="notification-count">{notificationCount}</span>} (uncomment when ready to use ) */}
                        </NavLink>

                        {/* Profile Icon */}
                        <div className="nav-item dropdown " onMouseLeave={closeProfileDropdown}>
                            <button className="nav-link  profile-icon" onClick={toggleProfileDropdown} style={{ background: "transparent", border: "none", padding: 0 }}>
                                <img src="/assets/images/user.png" alt="Profile" width="50" height="50" className="rounded-circle"/>
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
                {/* This was made to test the notifications and inbox (Uncomment when ready to use )*/}
                {/*<button onClick={incrementInboxCount}>Simulate Inbox Notification</button>*/}
                {/*<button onClick={incrementNotificationCount}>Simulate Notification</button>*/}
            </nav>

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
        </div>
    );
}
