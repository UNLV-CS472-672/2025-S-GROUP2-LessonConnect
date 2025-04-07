import '../Styles/about.css'
export default function About({ darkMode }) {
    return (
        <>
            <div className={`about-us-page ${darkMode ? "dark-mode" : ""}`}>
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
                                    src="/assets/images/UNLV_pic.png"
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
                                    src="/assets/images/UNLV_pic.png"
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
                                {name: "Dorian Akhavan", role: "Back End Programmer", img: "/assets/images/UNLV_pic.png"},
                                {name: "Abdulrahman Alharbi", role: "Front End programmer", img: "/assets/images/UNLV_pic.png"},
                                {name: "Ashley Arellano", role: "Back End Lead", img: "/assets/images/UNLV_pic.png"},
                                {name: "Franklin La Rosa Diaz", role: "Front End Lead", img: "/assets/images/UNLV_pic.png"},
                                {name: "Jose Alarcon", role: "Front End Programmer", img: "/assets/images/UNLV_pic.png"},
                                {name: "Christopher Liscano", role: "Back End programme", img: "/assets/images/UNLV_pic.png"},
                                {name: "Ethan Zambrano", role: "Back End programmer", img: "/assets/images/UNLV_pic.png"},
                                {name: "Aviendha Andrus", role: "Back End programmer", img: "/assets/images/UNLV_pic.png"},
                                {name: "Sameer Issa", role: "Front End Programmer", img: "/assets/images/UNLV_pic.png"},
                                {name: "Allison Kameda", role: "Back End programmer", img: "/assets/images/UNLV_pic.png"},
                                {name: "Charles Joseph Ballesteros", role: "Back End programmer", img: "/assets/images/UNLV_pic.png"}
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
            </div>
        </>
    );
}
