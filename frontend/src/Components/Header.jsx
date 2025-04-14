import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

export default function Header() {
    const [openDropdown, setOpenDropdown] = useState(null);

    // Toggle dropdown open/close
    const toggleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    // Close dropdown when mouse leaves the dropdown area
    const closeDropdown = () => {
        setOpenDropdown(null);
    };

    return (
        <>
            <header>
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
                            <div className="navbar-nav ms-auto">
                                <NavLink to="/findTutor" className="nav-link">Find a tutor</NavLink>
                                <NavLink to="/services" className="nav-link">Services</NavLink>

                                {/* Support Dropdown */}
                                <div
                                    className="nav-item dropdown"
                                    onMouseLeave={closeDropdown}
                                >
                                    <button
                                        className="nav-link dropdown-toggle"
                                        onClick={() => toggleDropdown("support")}
                                    >
                                        Support
                                    </button>
                                    <div className={`dropdown-menu ${openDropdown === "support" ? "show" : ""}`}>
                                        <NavLink to="/about" className="dropdown-item">About Us</NavLink>
                                        <NavLink to="/contact" className="dropdown-item">Contact Us</NavLink>
                                        <NavLink to="/faqs" className="dropdown-item">FAQS</NavLink>
                                    </div>
                                </div>

                                {/* More Dropdown */}
                                <div
                                    className="nav-item dropdown"
                                    onMouseLeave={closeDropdown}
                                >
                                    <button
                                        className="nav-link dropdown-toggle"
                                        onClick={() => toggleDropdown("more")}
                                    >
                                        More
                                    </button>
                                    <div className={`dropdown-menu ${openDropdown === "more" ? "show" : ""}`}>
                                        <NavLink to="/learn_more" className="dropdown-item">Learn More</NavLink>
                                        <NavLink to="/resources" className="dropdown-item">Resources</NavLink>
                                        <NavLink to="/pomodoro" className="dropdown-item">Pomodoro</NavLink>
                                    </div>
                                </div>

                                {/* Spacing for Login Button */}
                                <div className="nav-login">
                                    <NavLink to="/login" className="btn btn-outline-light">Login</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}
