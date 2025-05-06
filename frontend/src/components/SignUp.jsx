import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../Styles/SignUp.css";
import countries from "../data/countries.json";

export default function SignUp() {
    const location = useLocation();
    const dob = location.state || {};

    const [formData, setFormData] = useState({
        country: "",
        email: "",
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        dateOfBirth: dob,
        termsAccepted: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.termsAccepted) {
            alert("You must accept the Terms of Service.");
            return;
        }

        try {
            const response = await axios.post("https://backend-d54p.onrender.com/users/register/", formData);
            alert("Registration successful!\n" + response.data.message);
        } catch (error) {
            alert("Registration failed! " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="signup-page">
            {/* Left Panel */}
            <div className="left-panel">
                <div className="brand-container">
                    <img src="/assets/images/bird.webp" alt="Some brand illustration" />
                    <div className="brand-card">
                        <h2>LessonConnect</h2>
                        <p>
                            A perfect place to connect students, tutors, and parents
                            for seamless learning experiences!
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="right-panel">
                <Link to="/" className="back-home-btn">
                    ← Back
                </Link>
                <div className="signup-container">
                    <h1>Create Your Account</h1>
                    <h2>We’re excited to have you on board!</h2>

                    <form className="signup-form" onSubmit={handleSubmit}>
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
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />

                        <div className="password-field">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </span>
                        </div>

                        <select name="country" onChange={handleChange} required>
                            <option value="">Select Country</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>

                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                name="termsAccepted"
                                onChange={handleChange}
                                required
                            />
                            <label>
                                I agree to the <a href="/terms">Terms of Service</a> and{" "}
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
    );
}
