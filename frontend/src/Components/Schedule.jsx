import "../Styles/Schedule.css";

export default function Schedule() {
    return (
        <>
            <section className="greeting">
                <div className="inner-container">
                    <h1>Hello Jose!</h1>
                    <p>It's time to learn</p>
                </div>
            </section>

            <section className="dashboard-section">
                <div className="inner-container dashboard-layout">
                    <div className="button-grid">
                        <div className="button-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Schedule Appt Tutor" />
                            <span>Schedule Appt Tutor</span>
                        </div>
                        <div className="button-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Profile" />
                            <span>Profile</span>
                        </div>
                        <div className="button-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Gaming Stats" />
                            <span>Gaming Stats</span>
                        </div>
                        <div className="button-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Talk to Your Tutor" />
                            <span>Talk to Your Tutor</span>
                        </div>
                        <div className="button-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Messages" />
                            <span>Messages</span>
                        </div>
                        <div className="button-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Pomodoro Timer" />
                            <span>Pomodoro Timer</span>
                        </div>
                    </div>

                    <div className="popular-tutors-side">
                        <h2>Popular Tutors</h2>
                        <div className="tutor-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Tutor 1" />
                            <div className="tutor-info">
                                <span className="subject-tag">Math</span>
                                <h3>Prof. Jane Doe</h3>
                                <p>5 Years</p>
                            </div>
                        </div>
                        <div className="tutor-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Tutor 2" />
                            <div className="tutor-info">
                                <span className="subject-tag">Physics</span>
                                <h3>Dr. Bruce Banner</h3>
                                <p>88 Years</p>
                            </div>
                        </div>

                        <div className="tutor-card">
                            <img src="/assets/images/UNLV_pic.png" alt="Tutor 4" />
                            <div className="tutor-info">
                                <span className="subject-tag">Chemistry</span>
                                <h3>Ms. Sara Kim</h3>
                                <p>4 Years</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="extra-section">
                <div className="inner-container">
                    <p>Maybe another section for something here</p>
                </div>
            </section>
        </>
    );
}
