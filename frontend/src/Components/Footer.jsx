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