import { useLocation } from "react-router-dom";
import { useState } from "react";
import "../Styles/SignUp.css"; // Import the CSS file
import axios from "axios";

export default function SignUp() {
    const location = useLocation();
    // this will help later for the back end
    const dob = location.state || {};

    const [formData, setFormData] = useState({
        country: "",
        email: "",
        firstName: "",
        lastName: "",
        displayName: "",
        password: "",
        termsAccepted: false,
    });

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
        console.log("Sign-Up form submitted", formData);

        try {
            const response = await axios.post("http://127.0.0.1:8000/users/register/", formData);

            // Store only the access and refresh tokens
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);


            alert("Registration successful!");
        } catch (error) {
            alert("Registration failed! " + (error.response?.data?.message || error.message));
        }
    };


    return (
        <div className="signup-page">
            {/* Left Panel */}
            <div className="left-panel">
                <div className="brand-container">
                    {/* Replace with your own brand image */}
                    <img src="assets/images/bird.webp" alt="Some brand illustration" />
                    <div className="brand-card">
                        <h2>LessonConnect</h2>
                        <p>
                            A perfect place to connect students, tutors, and parents
                            for seamless learning experiences!
                        </p>
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
