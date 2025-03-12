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
                        <h3>LessonConnect connects students with experienced tutors and personalized lesson plans across subjects like Art, Science, Math, English, and Technology. It offers one-on-one tutoring, interactive resources, and tools to enhance learning. With easy communication, scheduling, and full transparency, it ensures a productive and safe learning experience for students and parents.</h3>
                    </div>
                </section>

                <section id="panels" className="py-5">
                    <div className="container">
                        <div className="row justify-content-center gx-3 gy-4">
                            <div className="col-lg-4 col-md-6 col-sm-12 d-flex">
                                <div className="panel card shadow-lg p-3 flex-fill" id="panel1">
                                    <img src="assets/images/UNLV_pic.png" alt="Tutoring"
                                         className="card-img-top panel-img"/>
                                    <div className="card-body">
                                        <h5 className="card-title">Tutoring</h5>
                                        <ul className="list-unstyled">
                                            <li><a href="#">Art</a></li>
                                            <li><a href="#link">Math</a></li>
                                            <li><a href="#">English</a></li>
                                            <li><a href="#">Science</a></li>
                                            <li><a href="#">Technology</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12 d-flex">
                                <div className="panel card shadow-lg p-3 flex-fill" id="panel2">
                                    <img src="assets/images/UNLV_pic.png" alt="Resources"
                                         className="card-img-top panel-img"/>
                                    <div className="card-body">
                                        <h5 className="card-title">Resources</h5>
                                        <ul className="list-unstyled">
                                            <li><a href="#link">Games</a></li>
                                            <li><a href="#">Scheduling</a></li>
                                            <li><a href="#">Whiteboard</a></li>
                                            <li><a href="#">Find A Tutor</a></li>
                                            <li><a href="#">Find a Lesson</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12 d-flex">
                                <div className="panel card shadow-lg p-3 flex-fill" id="panel3">
                                    <img src="assets/images/UNLV_pic.png" alt="Pomodoro"
                                         className="card-img-top panel-img"/>
                                    <div className="card-body">
                                        <h5 className="card-title">Pomodoro</h5>
                                        <ul className="list-unstyled">
                                            <li><a href="#link">Pomodoro Timer</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
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
