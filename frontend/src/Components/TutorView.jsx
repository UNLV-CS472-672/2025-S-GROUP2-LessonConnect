import { useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/TutorView.css";

const dashboardOptions = [
    { text: "Manage Sessions", img: "/assets/images/UNLV_pic.png" },
    { text: "Upload Assignments", img: "/assets/images/UNLV_pic.png" },
    { text: "Student Progress", img: "/assets/images/UNLV_pic.png" },
    { text: "Messages", img: "/assets/images/UNLV_pic.png" },
    { text: "Availability", img: "/assets/images/UNLV_pic.png" },
    { text: "Create Quiz", img: "/assets/images/UNLV_pic.png" },
    { text: "Session Notes", img: "/assets/images/UNLV_pic.png" },
    { text: "Profile", img: "/assets/images/UNLV_pic.png" },
];

const sidebarOptions = [
    "Resources",
    "Settings",
    "Calendar",
    "Student Requests",
    "Post Announcements",
    "Sticker Book"
];

export default function TutorView() {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    const closeDropdown = () => {
        setOpenDropdown(null);
    };

    return (
        <div className="tutor-dashboard-page">

            {/* Custom Header */}
            <header>
                <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                    <div className="container">
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
                            <div className="navbar-nav ms-auto">
                                <Link to="/findTutor" className="nav-link">Find a tutor</Link>
                                <Link to="/services" className="nav-link">Services</Link>

                                <div className="nav-item dropdown" onMouseLeave={closeDropdown}>
                                    <button
                                        className="nav-link dropdown-toggle"
                                        onClick={() => toggleDropdown("support")}
                                    >
                                        Support
                                    </button>
                                    <div className={`dropdown-menu ${openDropdown === "support" ? "show" : ""}`}>
                                        <Link to="/about" className="dropdown-item">About Us</Link>
                                        <Link to="/contact" className="dropdown-item">Contact Us</Link>
                                        <Link to="/faqs" className="dropdown-item">FAQS</Link>
                                    </div>
                                </div>

                                <div className="nav-item dropdown" onMouseLeave={closeDropdown}>
                                    <button
                                        className="nav-link dropdown-toggle"
                                        onClick={() => toggleDropdown("more")}
                                    >
                                        More
                                    </button>
                                    <div className={`dropdown-menu ${openDropdown === "more" ? "show" : ""}`}>
                                        <Link to="/learn_more" className="dropdown-item">Learn More</Link>
                                        <Link to="/resources" className="dropdown-item">Resources</Link>
                                        <Link to="/pomodoro" className="dropdown-item">Pomodoro</Link>
                                    </div>
                                </div>

                                <div className="nav-item ms-3">
                                    <Link to="/login" className="nav-link">
                                        <i className="bi bi-person-circle fs-4 text-light"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

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
                            <div className="button-card" key={index}>
                                <img src={option.img} alt={option.text} />
                                <span>{option.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="sidebar-buttons">
                        {sidebarOptions.map((label, index) => (
                            <button key={index}>{label}</button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
