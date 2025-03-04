import React from 'react';

export default function SignUp() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your sign-up logic here
        console.log('Sign Up form submitted');
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
                    background: linear-gradient(120deg, #e6f0ff, #f5f7fa);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }

                .signup-container {
                    background: #fff;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
                    width: 100%;
                    max-width: 400px;
                    text-align: center;
                }

                .signup-container h1 {
                    margin-bottom: 20px;
                    font-weight: 700;
                }

                .signup-form .form-label {
                    font-weight: bold;
                    color: #333;
                }

                .signup-form .form-control {
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 12px;
                    margin-bottom: 15px;
                    transition: 0.3s;
                }

                .signup-form .form-control:focus {
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
                    width: 100%;
                }

                .btn:hover {
                    background-color: #555;
                }

                .signup-container p {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #555;
                }

                .signup-container a {
                    color: #0073e6;
                    text-decoration: none;
                }

                .signup-container a:hover {
                    text-decoration: underline;
                }

                @media (max-width: 400px) {
                    .signup-container {
                        padding: 30px;
                    }
                }
            `}</style>

            <div className="container signup-container">
                <h1>Create Your Account</h1>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">
                            First Name*
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">
                            Last Name*
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email address*
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password*
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Enter a strong password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn">
                        Sign Up
                    </button>
                </form>
                <p className="mt-3">
                    Already have an account?{' '}
                    <a href="/login">Log In</a>
                </p>
            </div>
        </>
    );
}
