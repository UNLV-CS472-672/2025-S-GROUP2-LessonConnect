import { Link } from "react-router-dom";

export default function Learn_more() {
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
        </>
    );
}
