import { Link } from "react-router-dom";
import "../Styles/Logout.css";

export default function Logout() {
    return (
        <div className="logout-page-container">
            <div className="logout-page">
                <div className="logout-container">
                    <div className="bird-container">
                        <img
                            src="assets/images/bird.webp"
                            alt="Artistic bird illustration"
                        />
                    </div>
                    <div className="logout-content">
                        <h1 className="logout-title">Thank you for visiting LessonConnect</h1>
                        <p className="logout-message">We hope you had a great learning experience!</p>
                        <div className="logout-buttons">
                            <Link to="/" className="btn">
                                Return to Home
                            </Link>
                            <Link to="/learn_more" className="btn">
                                Learn More
                            </Link>
                            <Link to="/login" className="btn">
                                Log In Again
                            </Link>
                            <Link to="/roleSelect" className="btn">
                                Create New Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
