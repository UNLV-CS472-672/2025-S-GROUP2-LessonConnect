import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function SignUp() {
    const location = useLocation();
    const dob = location.state || {};

    const [formData, setFormData] = useState({
        country: "",
        email: "",
        firstName: "",
        lastName: "",
        displayName: "",
        password: "",
        termsAccepted: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.termsAccepted) {
            alert("You must accept the Terms of Service.");
            return;
        }
        console.log("Sign-Up form submitted", formData);
        // Add any sign-up logic or API calls here
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

        /* ====== Right Panel (SignUp Form) ====== */
        .right-panel {
          flex: 1;
          background-color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }
        .signup-container {
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        .signup-container h1 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        .signup-container h2 {
          font-size: 16px;
          font-weight: 400;
          color: #666;
          margin-bottom: 20px;
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .signup-form select,
        .signup-form input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          text-align: left;
        }
        .checkbox-container a {
          color: #0073e6;
          text-decoration: none;
        }
        .checkbox-container a:hover {
          text-decoration: underline;
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
                            <p>A perfect place to connect students, tutors, and parents for seamless learning experiences!</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel (SignUp Form) */}
                <div className="right-panel">
                    <div className="signup-container">
                        <h1>Create Your Account</h1>
                        <h2>We’re excited to have you on board!</h2>

                        <form className="signup-form" onSubmit={handleSubmit}>
                            <select name="country" onChange={handleChange} required>
                                <option value="">Select Country</option>
                                <option value="United States">United States</option>
                                <option value="Canada">Canada</option>
                                <option value="United Kingdom">United Kingdom</option>
                            </select>

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="displayName"
                                placeholder="Display Name"
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />

                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    onChange={handleChange}
                                    required
                                />
                                <label>
                                    I agree to the{" "}
                                    <a href="/terms">Terms of Service</a> and{" "}
                                    <a href="/privacy">Privacy Policy</a>
                                </label>
                            </div>

                            <button type="submit" className="btn">
                                Create Account
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
