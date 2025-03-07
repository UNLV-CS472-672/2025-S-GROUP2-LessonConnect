import {Link, NavLink} from "react-router-dom";

export default function About() {
    return (
        <>
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
                                style={{maxWidth: "100%"}}
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
                                src="assets/images/UNLV_pic.png"
                                alt="LessonConnect Team"
                                className="img-fluid rounded"
                            />
                        </div>
                        <div className="col-lg-6 text-content">
                            <h2 className="fw-bold">Our Project</h2>
                            <p className="lead">
                                LessonConnect: A Safe, Integrated Communication and Scheduling Platform for Private
                                Tutoring
                            </p>
                            <p className="text-muted">
                                LessonConnect is designed to streamline communication between tutors, students, and
                                parents.
                                Our platform offers intuitive scheduling, instant messaging, and shared resources to
                                ensure a
                                structured, productive tutoring experience.
                                With **safety and transparency at its core**, LessonConnect empowers students to **focus
                                on learning**
                                while providing parents with full oversight.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="our-team" className="py-5">
                <div className="container">
                    <h2 className="fw-bold">Our Team</h2>
                    <p className="lead">Meet the passionate minds behind LessonConnect</p>
                    <p className="text-muted">
                        We are a dedicated team of Computer Science students at UNLV, specializing in
                        software development, UI/UX, project management, and systems architecture.
                        Our goal is to build innovative solutions that enhance the online learning experience.
                    </p>
                    <div className="row team-container">
                        {[
                            {name: "Dorian Akhavan", role: "Lead Developer", img: "assets/images/UNLV_pic.png"},
                            {name: "Abdulrahman Alharbi", role: "Backend Engineer", img: "assets/images/UNLV_pic.png"},
                            {name: "Ashley Arellano", role: "UI/UX Designer", img: "assets/images/UNLV_pic.png"},
                            {name: "Franklin La Rosa Diaz", role: "Project Manager", img: "assets/images/UNLV_pic.png"},
                            {name: "Jose Alarcon", role: "Frontend Developer", img: "assets/images/UNLV_pic.png"},
                            {name: "Christopher Liscano", role: "Security Engineer", img: "assets/images/UNLV_pic.png"},
                            {name: "Ethan Zambrano", role: "Database Engineer", img: "assets/images/UNLV_pic.png"},
                            {name: "Aviendha Andrus", role: "QA Engineer", img: "assets/images/UNLV_pic.png"},
                            {name: "Sameer Issa", role: "Systems Architect", img: "assets/images/UNLV_pic.png"},
                            {name: "Allison Kameda", role: "Full-Stack Developer", img: "assets/images/UNLV_pic.png"},
                            {name: "Charles Joseph Ballesteros", role: "DevOps Engineer", img: "assets/images/UNLV_pic.png"}
                        ].map((member, index) => (
                            <div className="col-lg-4 col-md-6 col-sm-12 team-member" key={index}>
                                <img src={member.img} alt={member.name}/>
                                <h4>{member.name}</h4>
                                <p>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="bg-dark text-light py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 col-sm-6 mb-3">
                            <h6 className="fw-semibold">LessonConnect</h6>
                            <ul className="list-unstyled">
                                <li>
                                    <a href="#" className="text-light text-decoration-none"
                                    >About Us</a
                                    >
                                </li>
                                <li>
                                    <a href="#" className="text-light text-decoration-none"
                                    >Learn More</a
                                    >
                                </li>
                                <li>
                                    <a href="#" className="text-light text-decoration-none"></a>
                                </li>
                                <li>
                                    <a href="#" className="text-light text-decoration-none"
                                    >Services</a
                                    >
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
        </>
    );
}
