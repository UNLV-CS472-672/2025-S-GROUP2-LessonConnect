import React from 'react';

export default function Login() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your logic here (e.g., call an API or navigate in React Router)
        console.log('Login form submitted');
    };

    return (
        <>
            <style>{`
                /* ====== Base Reset & Global Styles ====== */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: Arial, sans-serif;
                    background: linear-gradient(120deg, #fcfcfc, #f5f7fa);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }

                /* ====== Container ====== */
                .login-container {
                    text-align: center;
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
                    width: 100%;
                    max-width: 400px;
                }

                /* ====== Heading ====== */
                .login-container h1 {
                    margin-bottom: 20px;
                    font-weight: 700;
                }

                /* ====== Form Styles ====== */
                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .login-form label {
                    font-size: 14px;
                    text-align: left;
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #333;
                }

                .login-form input {
                    padding: 12px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 14px;
                    transition: 0.3s;
                }

                .login-form input:focus {
                    border-color: #000;
                    outline: none;
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

                /* ====== Links & Text ====== */
                .login-container p {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #555;
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
                    gap: 10px;
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

                .social-login button img {
                    width: 20px;
                    height: 20px;
                }

                .social-login button:hover {
                    background-color: #f1f1f1;
                }

                /* ====== Responsive Design ====== */
                @media (max-width: 400px) {
                    .login-container {
                        padding: 30px;
                    }
                }
            `}</style>

            <div className="container login-container">
                <h1>Welcome back</h1>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email address*</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                    />

                    <label htmlFor="password">Password*</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                    />

                    <button type="submit" className="btn">
                        Continue
                    </button>
                </form>
                <p>
                    Don&apos;t have an account?{' '}
                    <a href="/signup">Sign Up</a>
                </p>

                <div className="divider">OR</div>

                <div className="social-login">
                    <button type="button" className="google">
                        <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA4CAMAAABuU5ChAAAA..."
                            alt="Google"
                        />
                        Continue with Google
                    </button>

                    <button type="button" className="microsoft">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                            alt="Microsoft"
                        />
                        Continue with Microsoft Account
                    </button>

                    <button type="button" className="apple">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                            alt="Apple"
                        />
                        Continue with Apple
                    </button>

                    <button type="button" className="phone">
                        <img
                            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
                            alt="Phone"
                        />
                        Continue with phone
                    </button>
                </div>
            </div>
        </>
    );
}
