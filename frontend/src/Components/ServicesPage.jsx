import "../Styles/ServicesPage.css";
import {Link, NavLink} from "react-router-dom";
export default function ServicesPage() {
    return (
        <>
            <div className="services-page-container">
                <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                    <div className="container">
                        <NavLink to="/" className="navbar-brand">
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
                                <Link to="/ServicesPage" className="nav-link">Services</Link>
                                <a href="#schedule-target" className="nav-link">Schedule</a>
                                <Link to="/Learn_more" className="nav-link">Learn More</Link>
                                <Link to="/About" className="nav-link">About Us</Link>
                                <Link to="/Login" className="btn btn-outline-light ms-4">Login</Link>
                            </div>
                        </div>
                    </div>
                </nav>
                <section id = "top-header-section">
                    <div className="header-top">
                        <h1>Services Offered </h1>
                        <h3>Our tutoring website connects students with experienced tutors and customized lesson plans in subjects like art, science, math, English, and technology. In addition to one-on-one tutoring, we offer interactive resources, educational games, and engaging study tools to enhance learning. LessonConnect is designed to streamline communication between tutors, students, and parents, offering intuitive scheduling, instant messaging, and shared resources to ensure a structured, productive tutoring experience. With safety and transparency at its core, LessonConnect empowers students to focus on learning while providing parents with full oversight. Students can also connect with tutors through messaging and virtual sessions, ensuring personalized support tailored to their needs.</h3>
                    </div>

                </section>
                <section id="panels">
                    <div className="service-panel">
                        <div className="panel">
                            <img src="assets/images/UNLV_pic.png" alt="alternatetext"/>
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
                            <img src="assets/images/UNLV_pic.png" alt="alternatetext"/>
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
                            <img src="assets/images/UNLV_pic.png" alt="alternatetext"/>
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
                                    <h6 className="fw-semibold">LessonConnect</h6>
                                    <ul className="list-unstyled">
                                        <li>
                                            <Link to="/About" className="nav-link">About Us</Link>
                                        </li>
                                        <li>
                                            <Link to="/Learn_more" className="nav-link">Learn More</Link>
                                        </li>
                                        <li>
                                            <a href="#" className="text-light text-decoration-none"></a>
                                        </li>
                                        <li>
                                            <Link to="/ServicesPage" className="nav-link">Services</Link>
                                        </li>
                                        <li>
                                            <a href="#" className="text-light text-decoration-none"
                                            >Schedule</a
                                            >
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-3 col-sm-6 mb-3">
                                    <h6 className="fw-semibold">Customer Service</h6>
                                    <ul className="list-unstyled">
                                        <li>
                                            <a href="#" className="text-light text-decoration-none">FAQs</a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-light text-decoration-none"
                                            >Support</a
                                            >
                                        </li>
                                        <li>
                                            <a href="#" className="text-light text-decoration-none"
                                            >Contact Us</a
                                            >
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-3">
                            <p className="mb-0">&copy; 2025 LessonConnect. All Rights Reserved.</p>
                        </div>
                    </footer>
                </section>
            </div>


        </>
    );
}