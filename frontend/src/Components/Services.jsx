import "../Styles/Services.css";

export default function Services() {
    return (
        <>
            <div className="services-page-container">
                <section id = "top-header-section">
                    <div className="header-top">
                        <h1>Empowering Students Through Personalized Learning </h1>
                        <p>Connect with expert tutors and interactive tools designed to enhance learning across various subjects..</p>
                    </div>
                </section>

                <h2>Our Services</h2>

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
                                            <p>Temporary links Below</p>
                                            <li><a href="/chat">Chat UI</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
