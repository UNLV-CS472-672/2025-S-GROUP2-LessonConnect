import "../Styles/TutorView.css";

const dashboardOptions = [
    { text: "Manage Sessions", img: "/assets/images/UNLV_pic.png" },
    { text: "Upload Assignments", img: "/assets/images/UNLV_pic.png" },
    { text: "Student Progress", img: "/assets/images/UNLV_pic.png" },
    { text: "Messages", img: "/assets/images/UNLV_pic.png" },
    { text: "Availability", img: "/assets/images/UNLV_pic.png" },
    { text: "Create Quiz", img: "/assets/images/UNLV_pic.png" },
    { text: "Session Notes", img: "/assets/images/UNLV_pic.png" },
    { text: "Profile", img: "/assets/images/UNLV_pic.png" },
];

const sidebarOptions = [
    "Resources",
    "Student Handbook",
    "Tutoring Support",
    "Community Forum",
    "Settings"
];

export default function TutorView() {
    return (
        <div className="tutor-dashboard-page">
            <section className="greeting">
                <div className="inner-container">
                    <h1 className="fade-in">👋 Welcome back, Jose!</h1>
                    <p className="subheading">Ready to level up your skills today?</p>
                </div>
            </section>

            <section className="dashboard-section">
                <div className="inner-container dashboard-layout">
                    <div className="button-grid">
                        {dashboardOptions.map((option, index) => (
                            <div className="button-card" key={index}>
                                <img src={option.img} alt={option.text} />
                                <span>{option.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="sidebar-buttons">
                        {sidebarOptions.map((label, index) => (
                            <button key={index}>{label}</button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
