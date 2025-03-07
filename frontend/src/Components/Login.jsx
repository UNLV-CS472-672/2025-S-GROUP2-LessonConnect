export default function Login() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your login logic here
        console.log('Login form submitted');
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

                /* ====== Left Panel (Bird & Info) ====== */
                .left-panel {
                    flex: 1;
                    /* Soft gradient background */
                    background: linear-gradient(135deg, #d2e4df 20%, #c5dad5 100%);
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                }

                /* Bird Container:
                   Stack the image and info card in a column */
                .bird-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    z-index: 1; /* So it appears above background/pattern */
                    max-width: 350px;
                    text-align: center; /* So the text is centered as well */
                }

                .bird-container img {
                    width: 280px;
                    height: auto;
                    margin-bottom: 20px;
                    border-radius: 8px;
                    /* Subtle drop shadow */
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                /* Translucent Card for Headings */
                .info-card {
                    background-color: rgba(255, 255, 255, 0.7);
                    padding: 20px 30px;
                    border-radius: 12px;
                    max-width: 300px;
                }
                .info-card h2 {
                    font-size: 22px;
                    margin-bottom: 10px;
                    font-weight: 600;
                    color: #333;
                }
                .info-card p {
                    font-size: 14px;
                    line-height: 1.6;
                    color: #555;
                }

                /* ====== Right Panel (Login Form) ====== */
                .right-panel {
                    flex: 1;
                    background-color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 40px;
                }
                .login-container {
                    width: 100%;
                    max-width: 350px;
                    text-align: left;
                }

                .login-container h1 {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 5px;
                    text-align: center;
                }
                .login-container h2 {
                    font-size: 16px;
                    font-weight: 400;
                    color: #666;
                    margin-bottom: 20px;
                    text-align: center;
                }

                /* ====== Form Styles ====== */
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-bottom: 10px;
                }
                .login-form label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 3px;
                }
                .login-form input {
                    border: none;
                    border-bottom: 1px solid #ccc;
                    padding: 10px 5px;
                    font-size: 14px;
                }
                .login-form input:focus {
                    outline: none;
                    border-bottom-color: #000;
                }

                /* ====== Sign-in Button ====== */
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

                /* ====== Links & Text ====== */
                .login-container .small-text {
                    font-size: 14px;
                    color: #555;
                    text-align: center;
                    margin-top: 10px;
                }
                .login-container a {
                    color: #0073e6;
                    text-decoration: none;
                }
                .login-container a:hover {
                    text-decoration: underline;
                }

                /* ====== Divider ====== */
                .divider {
                    margin: 20px 0;
                    font-size: 14px;
                    color: #777;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .divider::before,
                .divider::after {
                    content: "";
                    flex: 1;
                    height: 1px;
                    background-color: #ddd;
                    margin: 0 10px;
                }

                /* ====== Social Login Buttons ====== */
                .social-login {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .social-login button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px;
                    border: none;
                    border-radius: 5px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: 0.3s;
                    font-weight: bold;
                    background-color: #fff;
                    border: 1px solid #ccc;
                }
                .social-login button:hover {
                    background-color: #f1f1f1;
                }
                .social-login button img {
                    width: 20px;
                    height: 20px;
                }

                /* ====== Responsive Design ====== */
                @media (max-width: 768px) {
                    .wrapper {
                        flex-direction: column;
                    }
                    .left-panel, .right-panel {
                        flex: none;
                        width: 100%;
                    }
                    .left-panel {
                        padding: 20px;
                    }
                    .right-panel {
                        padding: 20px;
                    }
                    .bird-container img {
                        width: 220px;
                    }
                }
            `}</style>

            <div className="wrapper">
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
                                The safe and engaging way to connect tutors, students, and parents.
                                Join us to streamline your tutoring sessions, share resources,
                                and track progress—all in one place!
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

                            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                                {/*<a href="/forgot-password">Forgot password?</a>*/}
                            </div>

                            <button type="submit" className="btn">
                                Sign in
                            </button>
                        </form>

                        <p className="small-text">
                            {/*New to LessonConnect? */}
                            <a href="/dateofbirth">New to LessonConnect?</a>
                        </p>

                        <div className="divider">OR</div>

                        <div className="social-login">
                            <button type="button">
                                <img
                                    src="assets/images/google.png"
                                    alt="Google"
                                />
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
