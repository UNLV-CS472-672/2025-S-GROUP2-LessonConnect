import '../Styles/Support.css'
export default function Support() {
    return (
        <>
            <div className="support-page">
                <h1 className="support-title">LessonConnect Support</h1>

                {/* Support Options */}
                <div className="support-options">
                    <div className="option-card">
                        <span className="support-icon">🔑</span>
                        <a href="/reset-password">Forgot LessonConnect Password</a>
                    </div>
                    <div className="option-card">
                        <span className="support-icon">🛠️</span>
                        <a href="/troubleshooting">Troubleshooting Guide</a>
                    </div>
                    <div className="option-card">
                        <span className="support-icon">💳</span>
                        <a href="/billing">Billing & Subscription Help</a>
                    </div>
                </div>
            </div>
        </>
    );
}
