import { Link } from "react-router-dom";

export default function About() {
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

            {/* Section 1: Who We Are */}
            <section id="about-us" className="py-5 bg-light text-center">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h2 className="fw-bold">About Us</h2>
                            <p className="lead">
                                We are a team of senior Computer Science students at the University of Nevada,
                                Las Vegas, passionate about bridging the gap between students and tutors through
                                LessonConnect.
                            </p>
                            <p className="text-muted">
                                Our goal is to create a secure, efficient, and innovative learning platform that
                                connects tutors, students, and parents. Through LessonConnect, we empower learning
                                by integrating modern scheduling, messaging, and collaboration tools.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <img
                                src="assets/images/UNLV_pic.png"
                                alt="UNLV"
                                className="img-fluid rounded"
                                style={{ maxWidth: "100%" }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section id="our-project" className="py-5">
                <div className="container">
                    <div className="row align-items-center">
                        {/* Team Image on the Left */}
                        <div className="col-lg-6 text-center">
                            <img
                                src="assets/images/team_photo.jpg"
                                alt="LessonConnect Team"
                                className="img-fluid rounded"
                            />
                        </div>

                        {/* Text Content on the Right */}
                        <div className="col-lg-6 text-content">
                            <h2 className="fw-bold">Our Project</h2>
                            <p className="lead">
                                LessonConnect: A Safe, Integrated Communication and Scheduling Platform for Private Tutoring
                            </p>
                            <p className="text-muted">
                                LessonConnect is designed to streamline communication between tutors, students, and parents.
                                Our platform offers intuitive scheduling, instant messaging, and shared resources to ensure a
                                structured, productive tutoring experience.
                                With **safety and transparency at its core**, LessonConnect empowers students to **focus on learning**
                                while providing parents with full oversight.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Section 3: Our Team */}
            <section id="our-team" className="py-5 bg-light text-center">
                <div className="container">
                    <h2 className="fw-bold">Our Team</h2>
                    <p className="lead">Meet the passionate minds behind LessonConnect.</p>
                    <p className="text-muted">
                        We are a dedicated team of Computer Science students at UNLV, united by our passion for **problem-solving, software development, and innovation**. We thrive on pushing boundaries, learning continuously, and building impactful solutions.
                    </p>
                    <ul className="list-unstyled text-muted">
                        {[
                            "Dorian Akhavan",
                            "Abdulrahman Alharbi",
                            "Ashley Arellano",
                            "Franklin La Rosa Diaz",
                            "Jose Alarcon",
                            "Christopher Liscano",
                            "Ethan Zambrano",
                            "Aviendha Andrus",
                            "Sameer Issa",
                            "Allison Kameda",
                            "Charles Joseph Ballesteros",
                        ].map((name, index) => (
                            <li key={index}>{name}</li>
                        ))}
                    </ul>
                    <div className="d-flex justify-content-center mt-4">
                        <img
                            src="assets/team_photo.jpg"
                            alt="Our Team"
                            className="img-fluid rounded"
                            style={{ maxWidth: "600px" }}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
