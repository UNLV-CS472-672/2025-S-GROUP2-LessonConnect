import { NavLink } from "react-router-dom";
export default function Footer() {
    return (
        <footer className="bg-dark text-light py-4">
            <div className="container">
                {/* Top Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold">LessonConnect</h4>
                </div>

                <hr className="border-secondary" />

                {/* Middle Section - Three Columns */}
                <div className="row text-start">
                    <div className="col-md-4">
                        <h6 className="fw-semibold">Main</h6>
                        <ul className="list-unstyled">
                            <li><NavLink to="/" className="text-light text-decoration-none">Home</NavLink></li>
                            <li><NavLink to="/services" className="text-light text-decoration-none">Services</NavLink></li>
                            <li><NavLink to="/resources" className="text-light text-decoration-none">Resources</NavLink></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h6 className="fw-semibold">More</h6>
                        <ul className="list-unstyled">
                            <li><NavLink to="/faqs" className="text-light text-decoration-none">FAQs</NavLink></li>
                            <li><NavLink to="/about" className="text-light text-decoration-none">About Us</NavLink></li>
                            <li><NavLink to="/learn_more" className="text-light text-decoration-none">Learn More</NavLink></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h6 className="fw-semibold">Support</h6>
                        <ul className="list-unstyled">
                            <li><NavLink to="/support" className="text-light text-decoration-none">Support</NavLink></li>
                            <li><NavLink to="/contact" className="text-light text-decoration-none">Contact Us</NavLink></li>
                        </ul>
                    </div>
                </div>

                <hr className="border-secondary" />

                {/* Bottom Section - Platform Icons */}
                <div className="text-center">
                    <p className="mb-0">&copy; 2025 LessonConnect. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
