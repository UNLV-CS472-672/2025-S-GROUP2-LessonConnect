import '../Styles/Contact.css'
export default function Contact() {
    return (
        <>
            <section class="contact-header">
                <div class="container">
                    <h1 class="text-center fw-bold">Contact Us</h1>
                    <p class="text-center text-muted">
                        Have questions? We’re here to help.
                    </p>
                </div>
            </section>

            <section class="contact-info container my-5">
                <div class="row">
                    <div class="col-md-6">
                        <h3>Contact Information</h3>
                        <p><strong>Email:</strong> support@lessonconnect.com</p>
                        <p><strong>Phone:</strong> (702) 555-1234</p>
                        <p>
                            <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
                            (PST)
                        </p>
                        <p><strong>Location:</strong> University of Nevada, Las Vegas</p>
                    </div>
                    <div class="col-md-6">
                        <h3>Get in Touch</h3>
                        <form>
                            <div class="mb-3">
                                <label for="name" class="form-label">Full Name</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="name"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email Address</label>
                                <input
                                    type="email"
                                    class="form-control"
                                    id="email"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div class="mb-3">
                                <label for="message" class="form-label">Message</label>
                                <textarea
                                    class="form-control"
                                    id="message"
                                    rows="4"
                                    placeholder="Type your message"
                                ></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Send Message</button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
