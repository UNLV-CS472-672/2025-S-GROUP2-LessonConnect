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
                    <Link to="/dateofbirth" className="btn btn-outline-light">SignUp</Link>
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
                            }}>Some subtitle will go here!</h2>
                            <p>
                               Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam dolore ipsa magnam minima odit provident, quia quidem, reprehenderit repudiandae rerum sed unde? A delectus error fuga laborum omnis quo similique.
                            </p>
                        </div>
                        <div className="col-md-6">
                            <img className="middleUpper-pic" src="assets/images/Pic1.webp" alt="some image" />
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
                            }}>Some subtitle will go here!</h2>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad cum dicta eius illum iusto nemo suscipit vel voluptatem. Accusamus aliquid assumenda consectetur, enim est facere mollitia nihil non omnis quam.
                            </p>
                        </div>
                        <div className="col-md-6 order-md-1">
                            <img className="middleUpper-pic" src="assets/images/Pic2.avif" alt="some image" />
                        </div>
                    </div>
                </div>
            </section>

            <section id="lower-section">
                <div className="container">
                    <h2 style={{
                        textAlign: "center",
                        marginBottom: "60px",
                        fontSize: "30px",
                        fontWeight: 600
                    }}>
                        Some subtitle will go here!
                    </h2>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-6 text-center">
                            <img
                                src="assets/images/Pic3.webp"
                                className="lower-section-img"
                                alt="Some image"
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <div className="col-md-6 text-center">
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A assumenda atque distinctio doloremque ducimus eius hic inventore minus, natus obcaecati omnis quam recusandae similique sunt velit veritatis vero. Accusamus, nisi.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container my-5">
                <div className="gallery-container">
                    <div className="scrolling-gallery">
                        <div className="p-2">
                            <img
                                src="assets/images/coding.jpg"
                                className="gallery-item"
                                alt="Image 1"
                            />
                        </div>
                        <div className="p-2">
                            <img src="assets/images/Math_pic.jpg" className="gallery-item" alt="Image 2"/>
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/images/Music.webp"
                                className="gallery-item"
                                alt="Image 3"
                            />
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/images/philosophy_pic.webp"
                                className="gallery-item"
                                alt="Image 4"
                            />
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/images/Science_pic.jpg"
                                className="gallery-item"
                                alt="Image 5"
                            />
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/images/languages.avif"
                                className="gallery-item"
                                alt="Image 6"
                            />
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/images/writing.jpg"
                                className="gallery-item"
                                alt="Image 7"
                            />
                        </div>
                    </div>
                    <div className="scrolling-gallery-copy">
                        <div className="p-2">
                            <img
                                src="assets/images/coding.jpg"
                                className="gallery-item"
                                alt="Image 1"
                            />
                        </div>
                        <div className="p-2">
                            <img src="assets/images/Math_pic.jpg" className="gallery-item" alt="Image 2"/>
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/images/Music.webp"
                                className="gallery-item"
                                alt="Image 3"
                            />
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/images/philosophy_pic.webp"
                                className="gallery-item"
                                alt="Image 4"
                            />
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/images/Science_pic.jpg"
                                className="gallery-item"
                                alt="Image 5"
                            />
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/images/languages.avif"
                                className="gallery-item"
                                alt="Image 6"
                            />
                        </div>
                        <div className="p-2">
                            <img
                                src="assets/images/writing.jpg"
                                className="gallery-item"
                                alt="Image 7"
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