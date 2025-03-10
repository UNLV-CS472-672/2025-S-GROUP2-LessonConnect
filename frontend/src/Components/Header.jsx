import {Link, NavLink} from "react-router-dom";

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
                                <NavLink to="#findAtutor" className="nav-link">Find a tutor</NavLink>
                                <NavLink to="#services-target" className="nav-link">Services</NavLink>
                                <NavLink to="#schedule-target" className="nav-link">Schedule</NavLink>
                                <NavLink to="/about" className="nav-link">About Us</NavLink>
                                <NavLink to="/login" className="btn btn-outline-light">Login</NavLink>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}