import "../Styles/Login.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChanges = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        console.log("Login form submitted", formData);

        try {
            const response = await axios.post("https://backend-d54p.onrender.com/users/login/", formData);

            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("username", response.data.username);

            alert("Login successful!");
        } catch (error) {
            alert("Login failed! " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="login-page">
            {/* Left Panel with Bird & Info */}
            <div className="left-panel">
                <div className="bird-container">
                    <img
                        src="assets/images/bird.webp"
                        alt="Artistic bird illustration"
                    />
                    <div className="info-card">
                        <h2>LessonConnect</h2>
                        <p>
                            The safe and engaging way to connect tutors, students,
                            and parents. Join us to streamline your tutoring sessions,
                            share resources, and track progress—all in one place!
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel (Login Form) */}
            <div className="right-panel">
                <Link to="/" className="back-home-btn">
                    ← Back
                </Link>
                <div className="login-container">
                    <h1>LessonConnect</h1>
                    <h2>Welcome to LessonConnect</h2>

                    <form className="login-form" onSubmit={handleLogin}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            onChange={handleChanges}
                            placeholder="Username"
                            required
                        />

                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={handleChanges}
                            placeholder="********"
                            required
                        />

                        <div style={{ textAlign: "right", marginBottom: "10px" }}>
                            {/* <a href="/forgot-password">Forgot password?</a> */}
                        </div>

                        <button type="submit" className="btn">
                            Sign in
                        </button>
                    </form>

                    <p className="small-text">
                        <Link to="/roleSelect">New to LessonConnect?</Link>
                    </p>

                    <div className="divider">OR</div>

                    <div className="social-login">
                        <button type="button">
                            <img src="/assets/images/google.png" alt="Google" />
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
