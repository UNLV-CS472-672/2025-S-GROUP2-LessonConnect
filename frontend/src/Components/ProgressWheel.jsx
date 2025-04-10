import { ProgressBar } from "react-bootstrap";
import "../Styles/ProgressWheel.css"; // Add custom styles for the wheel
import PropTypes from "prop-types";

const ProgressWheel = ({ progress, darkMode }) => {
    return (
        <div className={`progress-wheel-container ${darkMode ? "dark-mode" : ""}`}>
            <div className="progress-wheel">
                <div className="progress-circle">
                    <div className="circle-background"></div>
                    <div
                        className="circle-progress"
                        style={{
                            background: `conic-gradient(#FF9149 ${progress}%, #F7374F ${progress}% 100%)`,
                        }}
                    ></div>
                    <div className="center-text">{progress}%</div>
                </div>
            </div>
            <div className="progress-stats">
                <p>Level: 5</p>
                <p>XP: 1200/1500</p>
            </div>
            <div className="progress-details">
                <div className="progress-item">
                    <p>Pomodoro</p>
                    <ProgressBar now={50} label="50%" />
                </div>
                <div className="progress-item">
                    <p>Lessons</p>
                    <ProgressBar now={75} label="75%" />
                </div>
                <div className="progress-item">
                    <p>Quizzes</p>
                    <ProgressBar now={60} label="60%" />
                </div>
                <div className="progress-item">
                    <p>Submissions</p>
                    <ProgressBar now={80} label="80%" />
                </div>
            </div>
        </div>
    );
};

export default ProgressWheel;

ProgressWheel.propTypes = {
    progress: PropTypes.number.isRequired,
    darkMode: PropTypes.bool.isRequired,
};