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
                <h1>Services </h1>
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
                <section id="info-section">
                    <div className="info-sec">
                        <h2>Information</h2>
                        <div className="info-para">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati, a facere sit ducimus
                            aut excepturi laudantium saepe, fuga delectus cupiditate officiis sunt blanditiis rerum
                            repudiandae est. Nobis dignissimos eveniet voluptatum corporis, vitae laudantium, numquam,
                            expedita qui velit nihil ullam voluptas? Reiciendis quo libero inventore reprehenderit.
                            Minima fugiat tempora impedit quisquam sapiente illo rem illum rerum consequuntur tempore,
                            magni quam ab optio. Nostrum adipisci animi itaque eos provident sit assumenda fugiat
                            mollitia quo maiores reiciendis magnam, id tempora deserunt voluptas illo doloremque
                            laudantium distinctio sed ipsam, veniam ex. Dolores incidunt laudantium dolor sequi quaerat
                            aliquid enim voluptatem autem adipisci aperiam. Illo beatae, magni laudantium unde impedit
                            rerum incidunt ratione necessitatibus maxime a quia ab animi saepe maiores qui doloremque
                            odio molestias illum cum assumenda provident commodi nostrum quod fuga. Velit voluptas
                            similique incidunt reiciendis nam. Dolorum, quasi cumque, tempora ipsam repellat minima,
                            sunt aut culpa ad distinctio odit! Numquam ex quia vitae quas reiciendis modi fugiat
                            reprehenderit ipsam maxime cumque dolorem blanditiis animi, cupiditate illum excepturi enim
                            delectus est commodi, aperiam voluptate iusto. Modi ratione aperiam esse eos dolorum,
                            provident laudantium optio sequi tempora dolores assumenda nobis veritatis aut eveniet odio
                            possimus voluptate quis soluta similique ex eius eum tenetur ad?
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