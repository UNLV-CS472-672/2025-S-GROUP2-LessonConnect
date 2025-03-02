import { Link } from "react-router-dom"; // Jose Added this for linking. look at lines 53 and 59
import { useEffect } from "react";
export default function Home() {
    useEffect(() => {
        // Function to handle scroll
        const onScroll = () => {
            if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                document.body.classList.remove("scroll-top");
            } else {
                document.body.classList.add("scroll-top");
            }
        };

        // Apply initial body attributes
        document.body.classList.add("scroll-top");
        document.body.setAttribute("data-bs-target", ".navbar");
        document.body.setAttribute("data-bs-spy", "scroll");
        document.body.setAttribute("data-bs-offset", "100");

        // Attach scroll event listener
        window.addEventListener("scroll", onScroll);


        // Cleanup function
        return () => {
            window.removeEventListener("scroll", onScroll);
            document.body.classList.remove("scroll-top");
            document.body.removeAttribute("data-bs-target");
            document.body.removeAttribute("data-bs-spy");
            document.body.removeAttribute("data-bs-offset");
        };
    }, []);

    return (
        <>
            <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                <div className="container">
                    <a href="#home" className="navbar-brand">
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
                            <a href="#resources-target" className="nav-link">Resources</a>
                            <Link to="/about" className="nav-link">About Us</Link>
                            <button type="button" className="btn btn-outline-light">Login</button>
                        </div>
                    </div>
                </div>
            </nav>

            <header id="home">
                <h3 className="display-2">
                    LessonConnect
                    <span className="text-body-secondary fs-6">with your favorite tutor.</span>
                </h3>
                <button type="button" className="btn btn-outline-dark">Sign Up</button>
                <Link to="/learn_more" className="btn btn-outline-light">Learn More</Link>

            </header>

            <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img
                            src="assets/Pic1.webp"
                            className="d-block w-100"
                            alt="A girl with headphones having a conversation with her tutor on her laptod "
                        />
                    </div>
                    <div className="carousel-item">
                        <img
                            src="assets/Pic2.avif"
                            className="d-block w-100"
                            alt="A girl raising her hand"
                        />
                    </div>
                    <div className="carousel-item">
                        <img
                            src="assets/Pic3.webp"
                            className="d-block w-100"
                            alt="A guy looking at his notebook while having virtual lessons"
                        />
                    </div>
                    <div className="carousel-item">
                        <img
                            src="assets/Pic4.jpg"
                            className="d-block w-100"
                            alt="A girl and her mom having virutal classes"
                        />
                    </div>
                    <div className="carousel-item">
                        <img
                            src="assets/Pic5.jpg"
                            className="d-block w-100"
                            alt="A girl with a guitar having some virtual lessons"
                        />
                    </div>
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <div className="container my-5">
                <div className="gallery-container">
                    <div className="scrolling-gallery">
                        <div className="p-2">
                            <img
                                src="assets/coding_pic.jpg"
                                className="gallery-item"
                                alt="Image 1"
                            />
                        </div>
                        <div className="p-2">
                            <img src="assets/Math_pic.jpg" className="gallery-item" alt="Image 2"/>
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/Music_pic.webp"
                                className="gallery-item"
                                alt="Image 3"
                            />
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/philosophy_pic.webp"
                                className="gallery-item"
                                alt="Image 4"
                            />
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/Science_pic.jpg"
                                className="gallery-item"
                                alt="Image 5"
                            />
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/languages_pic.jpg"
                                className="gallery-item"
                                alt="Image 6"
                            />
                        </div>
                    </div>
                    <div className="scrolling-gallery-copy">
                        <div className="p-2">
                            <img
                                src="assets/coding_pic.jpg"
                                className="gallery-item"
                                alt="Image 1"
                            />
                        </div>
                        <div className="p-2">
                            <img src="assets/Math_pic.jpg" className="gallery-item" alt="Image 2"/>
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/Music_pic.webp"
                                className="gallery-item"
                                alt="Image 3"
                            />
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/philosophy_pic.webp"
                                className="gallery-item"
                                alt="Image 4"
                            />
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/Science_pic.jpg"
                                className="gallery-item"
                                alt="Image 5"
                            />
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/languages_pic.jpg"
                                className="gallery-item"
                                alt="Image 6"
                            />
                        </div>
                    </div>
                </div>
            </div>

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