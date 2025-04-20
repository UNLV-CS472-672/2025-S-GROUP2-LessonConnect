import { Link, useNavigate } from "react-router-dom";
import "../Styles/RoleSelect.css";

export default function RoleSelect() {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        navigate("/SignUp", { state: { role } });
    };

    return (
        <div className="dob-page">
            {/* Left Panel */}
            <div className="left-panel">
                <div className="brand-container">
                    <img src="/assets/images/bird.webp" alt="Some brand illustration" />
                    <div className="brand-card">
                        <h2>LessonConnect</h2>
                        <p>
                            Creating a safe and enriching environment to grow,
                            learn, and share knowledge!
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Role Selection */}
            <div className="right-panel">
                <Link to="/" className="back-home-btn">
                    ← Back
                </Link>
                <div className="role-select-container">
                    <h1>Welcome to LessonConnect</h1>
                    <h2>Choose your role to begin</h2>
                    <div className="button-group">
                        <button className="btn" onClick={() => handleRoleSelect(3)}>
                            I&apos;m a Student
                        </button>
                        <button className="btn" onClick={() => handleRoleSelect(2)}>
                            I&apos;m a Parent
                        </button>
                        <button className="btn" onClick={() => handleRoleSelect(1)}>
                            I&apos;m a Tutor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
