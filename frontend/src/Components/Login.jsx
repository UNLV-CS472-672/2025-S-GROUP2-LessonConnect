import "../Styles/Login.css";

export default function Login() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your login logic here
        console.log("Login form submitted");
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
                <div className="login-container">
                    <h1>LessonConnect</h1>
                    <h2>Welcome to LessonConnect</h2>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="email">Username or Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="e.g., David Brooks"
                            required
                        />

                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="********"
                            required
                        />

                        <div style={{ textAlign: "right", marginBottom: "10px" }}>
                            {/*<a href="/forgot-password">Forgot password?</a>*/}
                        </div>

                        <button type="submit" className="btn">
                            Sign in
                        </button>
                    </form>

                    <p className="small-text">
                        <a href="/dateofbirth">New to LessonConnect?</a>
                    </p>

                    <div className="divider">OR</div>

                    <div className="social-login">
                        <button type="button">
                            <img src="assets/images/google.png" alt="Google" />
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
