import { useState } from "react";
import PropTypes from "prop-types";
import "../Styles/Settings.css";

export default function Settings({ darkMode }) {
    const [activePanel, setActivePanel] = useState("profile");

    // Profile State
    const [bio, setBio] = useState("");
    const [initialBio] = useState("");

    const [name, setName] = useState("");
    const [initialName] = useState("");

    // Account State
    const [username, setUsername] = useState("");
    const [initialUsername] = useState("");

    const [location, setLocation] = useState("");
    const [occupation, setOccupation] = useState("");
    const [discord, setDiscord] = useState("");
    const [github, setGithub] = useState("");

    // Email State
    const [primaryEmail, setPrimaryEmail] = useState("");
    const [backupEmail, setBackupEmail] = useState("");

    // Password State (no need to store initial password)
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleCancelProfile = () => {
        setBio(initialBio);
        setName(initialName);
    };

    const handleCancelAccount = () => {
        setUsername(initialUsername);
        setLocation("");
        setOccupation("");
        setDiscord("");
        setGithub("");
    };

    const handleCancelEmail = () => {
        setPrimaryEmail("");
        setBackupEmail("");
    };

    const handleCancelPassword = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const renderPanel = () => {
        switch (activePanel) {
            case "profile":
                return (
                    <div className="settings-panel-section">
                        <div className="section-header">
                            <h2>Public Profile</h2>
                        </div>

                        <h3 className="subsection-title">Profile picture</h3>
                        <div className="avatar-container">
                            <img
                                src="/assets/images/user.png"
                                alt="Profile"
                                className="avatar-img"
                            />
                            <button className="edit-avatar">Edit</button>
                        </div>

                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <p className="helper-text">Your name may appear publicly around the platform.</p>
                        </div>

                        <div className="form-group">
                            <label>Public email</label>
                            <select>
                                <option>Select a verified email</option>
                            </select>
                            <p className="helper-text">Choose which email is publicly visible.</p>
                        </div>

                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                placeholder="Tell us a little bit about yourself..."
                                maxLength={500}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                            <p className="helper-text">You can include links.</p>
                            <p className="char-counter">{bio.length}/500</p>
                        </div>

                        <div className="form-group">
                            <label>Pronouns</label>
                            <select>
                                <option>he/him</option>
                                <option>she/her</option>
                                <option>they/them</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>URL</label>
                            <input type="text" placeholder="https://yourwebsite.com" />
                        </div>

                        <div className="button-group">
                            <button className="save-btn">Save</button>
                            <button className="cancel-btn" onClick={handleCancelProfile}>Cancel</button>
                        </div>
                    </div>
                );

            case "account":
                return (
                    <div className="settings-panel-section">
                        <h2>Account Settings</h2>

                        <div className="form-group">
                            <label>Change Username</label>
                            <input
                                type="text"
                                placeholder="johnDoe123"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <p className="helper-text">This is your unique handle across the platform.</p>
                        </div>

                        <hr />

                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                placeholder="Las Vegas, NV"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                            <p className="helper-text">Share your city or region for better connection suggestions.</p>
                        </div>

                        <div className="form-group">
                            <label>Occupation</label>
                            <input
                                type="text"
                                placeholder="e.g. Computer Science Student"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                            />
                            <p className="helper-text">Helps others understand your background.</p>
                        </div>

                        <div className="form-group">
                            <label>Discord</label>
                            <input
                                type="text"
                                placeholder="johnDoe#4567"
                                value={discord}
                                onChange={(e) => setDiscord(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>GitHub</label>
                            <input
                                type="text"
                                placeholder="https://github.com/johnDoe"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                            />
                            <p className="helper-text">Showcase your projects and repositories.</p>
                        </div>

                        <div className="button-group">
                            <button className="save-btn">Save</button>
                            <button className="cancel-btn" onClick={handleCancelAccount}>Cancel</button>
                        </div>
                    </div>
                );

            case "email":
                return (
                    <div className="settings-panel-section">
                        <h2>Email Settings</h2>

                        <div className="form-group">
                            <label>Primary Email</label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={primaryEmail}
                                onChange={(e) => setPrimaryEmail(e.target.value)}
                            />
                            <p className="helper-text">Used for login and notifications.</p>
                        </div>

                        <div className="form-group">
                            <label>Backup Email</label>
                            <input
                                type="email"
                                placeholder="backup@email.com"
                                value={backupEmail}
                                onChange={(e) => setBackupEmail(e.target.value)}
                            />
                            <p className="helper-text">Fallback for password recovery and alerts.</p>
                        </div>

                        <div className="button-group">
                            <button className="save-btn">Save</button>
                            <button className="cancel-btn" onClick={handleCancelEmail}>Cancel</button>
                        </div>
                    </div>
                );

            case "security":
                return (
                    <div className="settings-panel-section">
                        <h2>Password & Security</h2>

                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="Create a strong password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Retype new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <div className="button-group">
                            <button className="save-btn">Update Password</button>
                            <button className="cancel-btn" onClick={handleCancelPassword}>Cancel</button>
                        </div>
                    </div>
                );

            default:
                return <div className="panel-section">Select a setting from the left menu</div>;
        }
    };

    return (
        <div className={`settings-wrapper ${darkMode ? "dark-mode" : ""}`}>
            <div className="profile-header">
                <img
                    src="/assets/images/user.png"
                    alt="User avatar"
                    className="profile-header-avatar"
                />
                <div className="profile-header-info">
                    <h3>Name Placeholder <span>(username placeholder)</span></h3>
                    <p>Your personal account</p>
                </div>
            </div>

            <div className="settings-container">
                <div className="settings-menu">
                    <div className={`menu-item ${activePanel === "profile" ? "active" : ""}`} onClick={() => setActivePanel("profile")}>
                        Public Profile
                    </div>
                    <div className={`menu-item ${activePanel === "account" ? "active" : ""}`} onClick={() => setActivePanel("account")}>
                        Account
                    </div>
                    <div className={`menu-item ${activePanel === "email" ? "active" : ""}`} onClick={() => setActivePanel("email")}>
                        Emails
                    </div>
                    <div className={`menu-item ${activePanel === "security" ? "active" : ""}`} onClick={() => setActivePanel("security")}>
                        Password & Security
                    </div>
                </div>

                <div className="settings-panel">{renderPanel()}</div>
            </div>
        </div>
    );
}

Settings.propTypes = {
    darkMode: PropTypes.bool.isRequired,
};
