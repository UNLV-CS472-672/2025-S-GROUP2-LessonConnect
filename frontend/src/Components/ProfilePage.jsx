import "../Styles/ProfilePage.css"
import userIcon from "/assets/images/UNLV_pic.png";

export default function ProfilePage() {
    return (
        <>
            <div className="profile-page-container">
                <div className="profile-page">
                    {/* Cover Section */}
                    <div className="cover-section"></div>

                    {/* Profile Content */}
                    <div className="profile-content container">
                        {/* Profile Header */}
                        <div className="profile-header">
                            <img src={userIcon} alt="Profile" className="profile-avatar" />
                            <div className="profile-info">
                                <h2 className="profile-name">John Doe</h2>
                                <p className="profile-title">Full-Stack Developer</p>
                                <p className="profile-bio">
                                    Passionate about creating modern web apps. Coffee lover ☕. Open
                                    source contributor.
                                </p>
                                <div className="profile-buttons">
                                    <button className="btn btn-danger">Follow</button>
                                    <button className="btn btn-outline-secondary">Message</button>
                                </div>
                            </div>
                        </div>

                        {/* Additional Panel */}
                        <div className="profile-panel">
                            <h4>About Me</h4>
                            <p>
                                Developer with a love for React, Node.js, and clean UI design.
                                Always eager to learn and collaborate.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
