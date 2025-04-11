import '../Styles/Contact.css'
export default function Contact() {
    return (
        <>
            <div className="contact-page">
                <section className="contact-header">
                    <div className="container">
                        <h1 className="text-center fw-bold">Contact Us</h1>
                        <p className="text-center text-muted">
                            Have questions? We’re here to help.
                        </p>
                    </div>
                </section>

                <section className="contact-info container my-5">
                    <div className="row">
                        <div className="col-md-6">
                            <h3>Contact Information</h3>
                            <p><strong>Email:</strong> support@lessonconnect.com</p>
                            <p><strong>Phone:</strong> (702) 555-1234</p>
                            <p>
                                <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
                                (PST)
                            </p>
                            <p><strong>Location:</strong> University of Nevada, Las Vegas</p>
                        </div>
                        <div className="col-md-6">
                            <h3>Get in Touch</h3>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        rows="4"
                                        placeholder="Type your message"
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Send Message</button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
