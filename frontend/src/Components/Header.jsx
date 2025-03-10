import {Link} from "react-router-dom";

export default function Header() {
    return (
        <>
            <header>
                <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                    <div className="container">
                        <Link to="/"  className="navbar-brand"><i className="bi bi-house-door"></i></Link>
                        <button
                            className="navbar-toggler"
                            data-bs-toggle="collapse"
                            data-bs-target="#nav-collapse"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div id="nav-collapse" className="collapse navbar-collapse">
                            <div className="navbar-nav ms-auto">
                                <Link to="#findAtutor" className="nav-link">Find a tutor</Link>
                                <Link to="#services-target" className="nav-link">Services</Link>
                                <Link to="#schedule-target" className="nav-link">Schedule</Link>
                                <Link to="/about" className="nav-link">About Us</Link>
                                <Link to="/login" className="btn btn-outline-light">Login</Link>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}