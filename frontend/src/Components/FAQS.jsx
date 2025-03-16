import '../Styles/FAQS.css';

export default function FAQS() {
    return (
        <div className="faq-page">
            {/* FAQ Section */}
            // FAQ Background Section
            <div className="faq-background">
                <img src="assets/images/FAQs.webp" alt="FAQs Background" className="faq-bg-image" />
                <h1 className="faq-title">FAQs:</h1>
            </div>

            <div className="faq-container">
                <h2 className="text-center fw-bold mb-4">Frequently Asked Questions</h2>
                <div className="accordion" id="faqAccordion">
                    {/* Question 1 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faq1"
                            >
                                What is LessonConnect?
                            </button>
                        </h2>
                        <div
                            id="faq1"
                            className="accordion-collapse collapse show"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                LessonConnect is an online platform that connects students with
                                expert tutors for real-time learning.
                            </div>
                        </div>
                    </div>

                    {/* Question 2 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#faq2"
                            >
                                How do I sign up for a tutoring session?
                            </button>
                        </h2>
                        <div
                            id="faq2"
                            className="accordion-collapse collapse"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                Simply create an account, browse tutors, and schedule a session
                                at your convenience.
                            </div>
                        </div>
                    </div>

                    {/* Question 3 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#faq3"
                            >
                                What subjects are available for tutoring?
                            </button>
                        </h2>
                        <div
                            id="faq3"
                            className="accordion-collapse collapse"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                LessonConnect covers a wide range of subjects, including Math,
                                Science, Coding, Music, and more.
                            </div>
                        </div>
                    </div>

                    {/* Question 4 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#faq4"
                            >
                                Is LessonConnect free?
                            </button>
                        </h2>
                        <div
                            id="faq4"
                            className="accordion-collapse collapse"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                LessonConnect offers both free and paid sessions, depending on
                                the tutor and subject.
                            </div>
                        </div>
                    </div>

                    {/* Question 5 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                data-bs-toggle="collapse"
                                data-bs-target="#faq5"
                            >
                                How can I become a tutor?
                            </button>
                        </h2>
                        <div
                            id="faq5"
                            className="accordion-collapse collapse"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                If you're interested in tutoring, sign up as a tutor and
                                complete the verification process.
                            </div>
                        </div>
                    </div>
                </div>
                {/* Didn't find your answer button */}
                <div className="faq-footer">
                    <p>Didn't find your answer?</p>
                    <a href="/contact" className="faq-button">Click here</a>
                </div>
            </div>
        </div>
    );
}
