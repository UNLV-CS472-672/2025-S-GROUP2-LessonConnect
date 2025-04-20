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
            <section id="header-section">
                <h3 className="display-2 header-title">
                    LessonConnect
                    <span className="text-body-secondary fs-6 staggered-subtitle">with your favorite tutor.</span>
                </h3>
                <div className="buttons-container">
                    <Link to="/roleSelect" className="btn btn-outline-light">Sign Up</Link>
                    <Link to="/learn_more" className="btn btn-outline-light">Learn More</Link>
                </div>
            </section>
            <section id="middleUpper-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h2 style={{
                                textAlign: "center",
                                marginBottom: "60px",
                                fontSize: "30px",
                                fontWeight: 600
                            }}>
                                Connect, Learn, and Grow with Your Favorite Tutor
                            </h2>
                            <p>
                                LessonConnect brings everything you need into one place—live video calls, secure messaging, file sharing, and effortless scheduling.
                                Whether you're preparing for a test or booking your next session, staying on track has never been easier.
                            </p>
                            <Link to="/roleSelect" className="btn btn-outline-dark" style={{ marginTop: "20px" }}>
                                Join LessonConnect
                            </Link>
                        </div>
                        <div className="col-md-6">
                            <div className="feature-icons">
                                <img className="middleUpper-pic" src="/assets/images/dashboard.png" alt="some image" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="middle-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 order-md-2">
                            <h2 style={{
                                textAlign: "center",
                                marginBottom: "60px",
                                fontSize: "30px",
                                fontWeight: 600
                            }}>Master Your Schedule with the LessonConnect Calendar</h2>
                            <p>
                                Stay on top of lessons, meetings, and practice sessions with our built-in calendar.
                                Easily filter events, auto-schedule sessions, and track your academic progress — all in one centralized place designed to keep your learning on track.
                            </p>
                        </div>
                        <div className="col-md-6 order-md-1">
                            <div className="feature-icons2">
                                <img className="middleUpper-pic" src="/assets/images/Calendar.png" alt="some image" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*Pomodoro section */}
            <section id="lower-section">
                <div className="container">
                    <h2 style={{
                        textAlign: "center",
                        marginBottom: "60px",
                        fontSize: "30px",
                        fontWeight: 600
                    }}>
                        Boost Focus & Productivity with Our Built-In Pomodoro Timer
                    </h2>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-6 text-center">
                            <img
                                src="/assets/images/Pomodoro_pic.png"
                                className="lower-section-img"
                                alt="Pomodoro Timer Feature"
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <div className="col-md-6 text-center">
                            <p>
                                Staying focused while studying can be tough, but LessonConnect
                                makes it easier! Our integrated Pomodoro Timer helps students stay
                                on track by breaking study sessions into manageable intervals with
                                short breaks in between. This proven technique enhances
                                concentration, prevents burnout, and maximizes learning
                                efficiency. Whether you tackling homework, reviewing for a
                                test, or working on a project, our Pomodoro feature keeps you
                                productive and motivated.
                            </p>
                            <Link to="/pomodoro" className="btn-pomodoro">Try the Pomodoro Timer Now</Link>
                        </div>
                    </div>
                </div>
            </section>
            {/*End of pomodoro section*/}
            <div className="container my-5">
                <div className="gallery-container">
                    <div className="scrolling-gallery">
                        <div className="p-2">
                            <a href="#a">
                                <img
                                    src="/assets/images/coding.jpg"
                                    className="gallery-item"
                                    alt="Image 1"
                                />
                            </a>
                        </div>
                        <div className="p-2">
                            <img src="/assets/images/Math_pic.jpg" className="gallery-item" alt="Image 2"/>
                        </div>
                        <div className="p-2">
                            <a href="#b">
                                <img
                                    src="/assets/images/Music.webp"
                                    className="gallery-item"
                                    alt="Image 3"
                                />
                            </a>
                        </div>
                        <div className="p-2">
                            <a href="#c">
                                <img
                                    src="/assets/images/philosophy_pic.webp"
                                    className="gallery-item"
                                    alt="Image 4"
                                />
                            </a>
                        </div>
                        <div className="p-2">
                            <a href="#d">
                                <img
                                    src="/assets/images/Science_pic.jpg"
                                    className="gallery-item"
                                    alt="Image 5"
                                />
                            </a>
                        </div>
                        <div className="p-2">
                            <a href="#e">
                                <img
                                    src="/assets/images/languages.avif"
                                    className="gallery-item"
                                    alt="Image 6"
                                />
                            </a>
                        </div>
                        <div className="p-2">
                            <a href="#f">
                                <img
                                    src="/assets/images/writing.jpg"
                                    className="gallery-item"
                                    alt="Image 7"
                                />
                            </a>
                        </div>
                    </div>
                    <div className="scrolling-gallery-copy">
                        <div className="p-2">
                            <a href="#a">
                                <img
                                    src="/assets/images/coding.jpg"
                                    className="gallery-item"
                                    alt="Image 1"
                                />
                            </a>
                        </div>
                        <div className="p-2">
                            <a href="#b">
                                <img src="/assets/images/Math_pic.jpg" className="gallery-item" alt="Image 2"/>
                            </a>
                        </div>
                        <div className="p-2">
                            <a href="#c">
                                <img
                                    src="/assets/images/Music.webp"
                                    className="gallery-item"
                                    alt="Image 3"
                                />
                            </a>
                        </div>
                        <div className="p-2">
                            <a href="#e">
                                <img
                                    src="/assets/images/philosophy_pic.webp"
                                    className="gallery-item"
                                    alt="Image 4"
                                />
                            </a>
                        </div>
                        <div className="p-2">
                            <a href="#f">
                                <img
                                    src="/assets/images/Science_pic.jpg"
                                    className="gallery-item"
                                    alt="Image 5"
                                />
                            </a>
                        </div>
                        <div className="p-2">
                            <a href="#e">
                                <img
                                    src="/assets/images/languages.avif"
                                    className="gallery-item"
                                    alt="Image 6"
                                />
                            </a>
                        </div>
                        <div className="p-2">
                            <a href="#f">
                                <img
                                    src="/assets/images/writing.jpg"
                                    className="gallery-item"
                                    alt="Image 7"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}