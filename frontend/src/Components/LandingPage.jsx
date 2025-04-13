import { useState } from 'react';
import { useNavigate } from "react-router-dom";  // for navigation
import '../Styles/LandingPage.css';

export default function LandingPage() {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();  // get navigation hook

    const handleClick = () => {
        // we are using React Router, then im thinking something like:
        // navigate("/whiteboard"); && link to the page... 
        navigate("/WhiteboardCanvas");
        console.log("Navigate to Whiteboard page...");
    };

    return (
        <div className="landing-page">
            {/* Animated gradient behind everything */}
            <div className="landing-page__background-gradient" />

            {/* Frosted overlay with content */}
            <div className="landing-page__content-overlay">
                <h1 className="landing-page__main-heading">
                    Welcome to <span className="landing-page__brand-name">LessonConnect</span>
                </h1>
                <p className="landing-page__tagline">
                    Experience the next-generation interactive whiteboard.<br />
                    Teach, learn, and collaborate with anyone, anywhere.
                </p>

                <button
                    className={`landing-page__cta-button ${
                        hovered ? 'landing-page__cta-button--hovered' : ''
                    }`}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={handleClick}
                >
                    Launch Whiteboard
                </button>
            </div>
        </div>
    );
}
