import {Link} from "react-router-dom";

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
            <section id="about-us" className="py-5 bg-light text-center">
                <div className="container">
                    <h2 className="fw-bold">About US</h2>
                    <p className="lead">
                        We are a team of senior Computer Science students at the University of
                        Nevada, Las Vegas.
                    </p>
                    <p className="text-muted">
                        As passionate learners and future innovators, we take pride in our
                        academic journey and the challenges we tackle in the field of technology.
                        Through collaboration, problem-solving, and dedication, we aim to develop
                        impactful solutions that push the boundaries of software development and
                        computer science. Our commitment to excellence reflects the high standards
                        of UNLV’s CS program, and we are proud to represent our university in all
                        our endeavors.
                    </p>
                    <div className="d-flex justify-content-center">
                        <img
                            src="assets/images/UNLV_pic.png"
                            alt="UNLV"
                            className="img-fluid rounded"
                            style={{maxWidth: "400px"}}
                        />
                    </div>
                </div>
            </section>

            <section id="our-project" className="py-5" style={{backgroundColor: "#e2e3e5", textAlign: "center"}}>
                <div className="container">
                    <h2 className="fw-bold">Our Project</h2>
                    <p className="lead">
                        LessonConnect: A Safe, Integrated Communication and Scheduling Platform
                        for Private Tutoring
                    </p>
                    <p className="text-muted">
                        Our project, LessonConnect, is designed to bridge the gap between private
                        tutors, students, and parents by providing a secure and efficient learning
                        environment. The platform combines scheduling, messaging, and
                        resource-sharing tools to streamline lesson planning and improve
                        educational outcomes. With a focus on safety and transparency,
                        LessonConnect empowers parents with full oversight, ensuring a productive
                        and structured tutoring experience.
                    </p>
                </div>
            </section>

            <section id="our-team" className="py-5 bg-light text-center">
                <div className="container">
                    <h2 className="fw-bold">Our Team</h2>
                    <p className="lead">Meet the passionate minds behind LessonConnect</p>
                    <p className="text-muted">
                        We are a team of dedicated senior Computer Science students at the
                        University of Nevada, Las Vegas. United by our love for problem-solving
                        and technology, we collaborate to build innovative and impactful
                        solutions. Our shared passion for software development drives us to push
                        boundaries, learn continuously, and tackle challenges head-on. The
                        following is a list of our current team members.
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
                            style={{maxWidth: "600px"}}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
