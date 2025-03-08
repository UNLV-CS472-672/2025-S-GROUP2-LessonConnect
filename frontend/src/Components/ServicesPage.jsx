import "../Styles/ServicesPage.css";
import {NavLink} from "react-router-dom";
export default function ServicesPage() {
    return (
        <>
            <div className="services-page-container">
                <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                    <div className="container">
                        <NavLink to="index.html" className="navbar-brand">
                            <i className="bi bi-house-door"></i>
                        </NavLink>
                        <button
                            className="navbar-toggler"
                            data-bs-toggle="collapse"
                            data-bs-target="#nav-collapse"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div id="nav-collapse" className="collapse navbar-collapse">
                            <div className="navbar-nav ms-auto">
                                <a href="services.html" className="nav-link">Services</a>
                                <a href="#schedule-target" className="nav-link">Schedule</a>
                                <a href="#resources-target" className="nav-link">Learn More</a>
                                <a href="about.html" className="nav-link">About Us</a>
                                <a href="login.html" className="btn btn-outline-light ms-4">Login</a>
                            </div>
                        </div>
                    </div>
                </nav>
                <h1>Services </h1>
                <section id="panels">
                    <div className="service-panel">
                        <div className="panel">
                            <img src="UNLV.png" alt="alternatetext"/>
                            <div className="text">Tutoring</div>
                            <ul>
                                <li className="panel-item"><a href="">Art</a></li>
                                <li className="panel-item"><a href="#link">Math</a></li>
                                <li className="panel-item"><a href="">English</a></li>
                                <li className="panel-item"><a href="">Science</a></li>
                                <li className="panel-item"><a href="">Technology</a></li>
                            </ul>
                        </div>
                        <div className="panel">
                            <img src="UNLV.png" alt="alternatetext"/>
                            <div className="text">Resources</div>
                            <ul>
                                <li className="panel-item"><a href="#link">Games</a></li>
                                <li className="panel-item"><a href="">Scheduling</a></li>
                                <li className="panel-item"><a href="">Whiteboard</a></li>
                                <li className="panel-item"><a href="">Find A Tutor</a></li>
                                <li className="panel-item"><a href="">Find a Lesson</a></li>
                            </ul>
                        </div>
                        <div className="panel">
                            <img src="UNLV.png" alt="alternatetext"/>
                            <div className="text">Pomodoro</div>
                            <ul>
                                <li className="panel-item"><a href="#link">Pomodoro Timer</a></li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section id="footer">
                    <footer className="bg-dark text-light py-4">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-3 col-sm-6 mb-3">
                                    <h6>LessonConnect</h6>
                                    <ul className="list-unstyled">
                                        <li>
                                            <a href="#" className="text-light text-decoration-none">About Us</a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-light text-decoration-none"
                                            >Learn More</a
                                            >
                                        </li>
                                        <li>
                                            <a href="#" className="text-light text-decoration-none">Services</a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-light text-decoration-none">Schedule</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-3 col-sm-6 mb-3">
                                    <h6>Customer Service</h6>
                                    <ul className="list-unstyled">
                                        <li>
                                            <a href="#" className="text-light text-decoration-none">FAQs</a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-light text-decoration-none">Support</a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-light text-decoration-none"
                                            >Contact Us</a
                                            >
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-3 col-sm-6 mb-3 text-md-end">
                                    <p className="mb-0">&copy; 2025 LessonConnect. All Rights Reserved.</p>
                                </div>
                            </div>
                        </div>
                    </footer>
                </section>
            </div>


        </>
    );
}