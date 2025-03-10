import {NavLink} from "react-router-dom";

export default function Footer() {
    return (
        <>
            <footer className="bg-dark text-light py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 col-sm-6 mb-3">
                            <h6 className="fw-semibold">LessonConnect</h6>
                            <ul className="list-unstyled">
                                <li>
                                    <NavLink to="/about" className="text-light text-decoration-none">About Us</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/learn_more" className="text-light text-decoration-none">Learn More</NavLink>
                                </li>
                                <li>
                                    <NavLink to="#" className="text-light text-decoration-none">Services</NavLink>
                                </li>
                                <li>
                                    <NavLink to="#" className="text-light text-decoration-none">Schedule</NavLink>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-3">
                            <h6 className="fw-semibold">Customer Service</h6>
                            <ul className="list-unstyled">
                                <li>
                                    <NavLink to="#" className="text-light text-decoration-none">FAQs</NavLink>
                                </li>
                                <li>
                                    <NavLink to="#" className="text-light text-decoration-none">Support </NavLink>
                                </li>
                                <li>
                                    <NavLink to="#" className="text-light text-decoration-none">Contact Us </NavLink>
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