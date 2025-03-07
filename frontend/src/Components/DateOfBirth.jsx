import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        navigate("/signup", { state: dob });
    };

    return (
        <>
            <style>{`
        /* Reset & Global Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f9fa;
        }

        /* ====== Wrapper for Split Layout ====== */
        .wrapper {
          display: flex;
          min-height: 100vh;
        }

        /* ====== Left Panel (Branding / Imagery) ====== */
        .left-panel {
          flex: 1;
          background: linear-gradient(135deg, #d2e4df 20%, #c5dad5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        .brand-container {
          max-width: 350px;
          text-align: center;
        }
        .brand-container img {
          width: 240px;
          height: auto;
          margin-bottom: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .brand-card {
          background-color: rgba(255, 255, 255, 0.7);
          padding: 20px 30px;
          border-radius: 12px;
        }
        .brand-card h2 {
          font-size: 22px;
          margin-bottom: 10px;
          font-weight: 600;
          color: #333;
        }
        .brand-card p {
          font-size: 14px;
          line-height: 1.6;
          color: #555;
        }

        /* ====== Right Panel (DOB Form) ====== */
        .right-panel {
          flex: 1;
          background-color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }

        .dob-container {
          width: 100%;
          max-width: 350px;
          text-align: center;
        }
        .dob-container h1 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        .dob-container h2 {
          font-size: 16px;
          font-weight: 400;
          color: #666;
          margin-bottom: 20px;
        }

        .dob-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .dob-form select,
        .dob-form input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
        }

        .btn {
          background-color: #000;
          color: #fff;
          padding: 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          transition: 0.3s;
        }
        .btn:hover {
          background-color: #555;
        }

        /* ====== Responsive Design ====== */
        @media (max-width: 768px) {
          .wrapper {
            flex-direction: column;
          }
          .left-panel, .right-panel {
            width: 100%;
            padding: 20px;
          }
          .brand-container img {
            width: 200px;
          }
        }
      `}</style>

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
                            <p>Creating a safe and enriching environment to grow, learn, and share knowledge!</p>
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
        </>
    );
}
