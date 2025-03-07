import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/DateOfBirth.css"; // Import the CSS file here

export default function DateOfBirth() {
    const navigate = useNavigate();
    const [dob, setDob] = useState({ month: "", day: "", year: "" });

    const handleChange = (e) => {
        setDob({ ...dob, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!dob.month || !dob.day || !dob.year) {
            alert("Please enter a valid date of birth.");
            return;
        }
        // Pass the DOB to /signup via react-router's navigate
        navigate("/signup", { state: dob });
    };

    return (
        <div className="dob-page">
            <div className="wrapper">
                {/* Left Panel */}
                <div className="left-panel">
                    <div className="brand-container">
                        {/* Replace with your own brand image */}
                        <img
                            src="assets/images/bird.webp"
                            alt="Some brand illustration"
                        />
                        <div className="brand-card">
                            <h2>LessonConnect</h2>
                            <p>
                                Creating a safe and enriching environment to grow,
                                learn, and share knowledge!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Panel (DOB Form) */}
                <div className="right-panel">
                    <div className="dob-container">
                        <h1>Create Account</h1>
                        <h2>Enter Your Date of Birth for a Safe Experience</h2>

                        <form className="dob-form" onSubmit={handleSubmit}>
                            <select name="month" onChange={handleChange} required>
                                <option value="">Month</option>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>

                            <select name="day" onChange={handleChange} required>
                                <option value="">Day</option>
                                {[...Array(31).keys()].map((day) => (
                                    <option key={day + 1} value={day + 1}>
                                        {day + 1}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                name="year"
                                placeholder="Year"
                                onChange={handleChange}
                                required
                                min="1900"
                                max={new Date().getFullYear()}
                            />

                            <button type="submit" className="btn">
                                Continue
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
