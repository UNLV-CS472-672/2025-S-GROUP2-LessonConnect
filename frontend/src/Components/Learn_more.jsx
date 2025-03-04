import { Link } from "react-router-dom";

export default function Learn_more() {
    return (
        <>
            <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                <div className="container">
                    <a href="index.html" className="navbar-brand">
                        <i className="bi bi-house-door"></i>
                    </a>
                    <button
                        className="navbar-toggler"
                        data-bs-toggle="collapse"
                        data-bs-target="#nav-collapse"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div id="nav-collapse" className="collapse navbar-collapse">
                        <div className="navbar-nav ms-auto">
                            <Link to="/" className="nav-link">Home</Link>
                            <a href="#services-target" className="nav-link">Services</a>
                            <a href="#schedule-target" className="nav-link">Schedule</a>
                            <Link to="/learn_more" className="nav-link">Learn More</Link>
                            <Link to="/about" className="nav-link">About Us</Link>
                            <a href="login.html" className="btn btn-outline-light ms-4">Login</a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Features Section */}
            <section id="features" className="py-5 text-center">
                <div className="container">
                    <div className="row justify-content-center">

                        {/* Learn More Card */}
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="icon">📖</div>
                                <h3 className="fw-bold">Learn More About LessonConnect</h3>
                                <p className="text-muted">
                                    LessonConnect is an online platform designed to connect students with expert tutors
                                    in a seamless, interactive learning environment.
                                </p>
                            </div>
                        </div>

                        {/* How It Works Card */}
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="icon">📅</div>
                                <h3 className="fw-bold">How LessonConnect Works</h3>
                                <p className="text-muted">
                                    Students can browse subjects, schedule virtual lessons, and engage in interactive
                                    one-on-one or group sessions tailored to their needs.
                                </p>
                            </div>
                        </div>

                        {/* Why Choose Us Card */}
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="icon">🏆</div>
                                <h3 className="fw-bold">Why Choose LessonConnect?</h3>
                                <p className="text-muted">
                                    We offer a user-friendly experience covering a variety of subjects, from coding
                                    to philosophy, ensuring high-quality virtual learning.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Join Now Section */}
            <section id="join-now" className="py-5 join-section text-center">
                <div className="container">
                    <h2 className="fw-bold">Join LessonConnect Today</h2>
                    <p className="text-muted">
                        Sign up, explore tutors, and book your first lesson. Whether you're a student
                        looking to improve or a tutor eager to share knowledge, LessonConnect is the
                        perfect space for growth.
                    </p>
                    <Link to="/signup" className="btn btn-primary btn-lg">Join Now</Link>
                </div>
            </section>
        </>
    );
}
