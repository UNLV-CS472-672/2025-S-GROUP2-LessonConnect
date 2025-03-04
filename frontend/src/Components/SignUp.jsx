export default function SignUp() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your sign-up logic here
        console.log('Sign Up form submitted');
    };

    return (
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
                {/* If using React Router, replace <a> with <Link to="/login"> */}
                <a href="/login">Log In</a>
            </p>
        </div>
    );
}

