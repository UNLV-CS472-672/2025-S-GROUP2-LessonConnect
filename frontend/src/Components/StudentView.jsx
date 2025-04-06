import React, {useState} from "react";
import "../Styles/StudentView.css";
import {Link, NavLink} from "react-router-dom";


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

    const [openDropdown, setOpenDropdown] = useState(null);

    // Toggle dropdown open/close
    const toggleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    // Close dropdown when mouse leaves the dropdown area
    const closeDropdown = () => {
        setOpenDropdown(null);
    };

    // State for notification counts
    const [inboxCount, setInboxCount] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);

    // Example of how to increment (you could use real-time data or API calls)
    const incrementInboxCount = () => setInboxCount(inboxCount + 1);
    const incrementNotificationCount = () => setNotificationCount(notificationCount + 1);


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
                            {inboxCount > 0 && <span className="notification-count">{inboxCount}</span>}
                        </NavLink>

                        {/* Notification Icon */}
                        <NavLink to="/notification" className="nav-link bell-icon">
                            <img src="/assets/images/bell.png" alt="Notification"  width="30" height="30" />
                            {notificationCount > 0 && <span className="notification-count">{notificationCount}</span>}
                        </NavLink>

                        {/* Profile Icon */}
                        <NavLink to="/profile" className="nav-link profile-icon">
                            <img src="/assets/images/user.png" alt="Profile" width="50" height="50" />
                        </NavLink>
                    </div>
                </div>
                {/* This was made to test the notifications and inbox */}
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
