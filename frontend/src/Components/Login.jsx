export default function Login() {
    // Optionally handle form submission in React (instead of `action`/`method`)
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your logic here (e.g., call an API or navigate in React Router)
        // For now, just a placeholder:
        console.log('Login form submitted');
    };

    return (
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
                {/* If you have React Router, change <a> to <Link> with a route */}
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
    );
}
