import { useState } from "react";
import PropTypes from "prop-types";
import "../Styles/Settings.css";

export default function Settings({ darkMode }) {
    const [activePanel, setActivePanel] = useState("profile");
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [role] = useState("student"); // Change this to "tutor" for testing

    // Profile State
    const [bio, setBio] = useState("");
    const [initialBio] = useState("");
    const [name, setName] = useState("");
    const [initialName] = useState("");

    // Tutor Fields
    const [tutorSubjects, setTutorSubjects] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");

    // Student Fields
    const [gradeLevel, setGradeLevel] = useState("");
    const [preferredSubjects, setPreferredSubjects] = useState("");
    const [emergencyContactName, setEmergencyContactName] = useState("");
    const [emergencyContactEmail, setEmergencyContactEmail] = useState("");

    // Account State
    const [username, setUsername] = useState("");
    const [location, setLocation] = useState("");
    const [occupation, setOccupation] = useState("");
    const [discord, setDiscord] = useState("");
    const [github, setGithub] = useState("");

    // Email State
    const [primaryEmail, setPrimaryEmail] = useState("");
    const [backupEmail, setBackupEmail] = useState("");

    // Password State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleCancelProfile = () => {
        setBio(initialBio);
        setName(initialName);
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 1000);
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
                            <img src="/assets/images/user.png" alt="Profile" className="avatar-img" />
                            <button className="edit-avatar">Change Picture</button>
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

                        {/*  Tutor-specific fields */}
                        {role === "tutor" && (
                            <>
                                <div className="form-group">
                                    <label>Subjects You Teach</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Math, Physics"
                                        value={tutorSubjects}
                                        onChange={(e) => setTutorSubjects(e.target.value)}
                                    />
                                    <p className="helper-text">Separate multiple subjects with commas.</p>
                                </div>

                                <div className="form-group">
                                    <label>Hourly Rate ($)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 30"
                                        value={hourlyRate}
                                        onChange={(e) => setHourlyRate(e.target.value)}
                                    />
                                    <p className="helper-text">This is how much you charge per hour of tutoring.</p>
                                </div>
                            </>
                        )}

                        {/*  Student-specific fields */}
                        {role === "student" && (
                            <>
                                <div className="form-group">
                                    <label>Grade Level</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 10th Grade"
                                        value={gradeLevel}
                                        onChange={(e) => setGradeLevel(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Preferred Subjects</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Biology, Algebra"
                                        value={preferredSubjects}
                                        onChange={(e) => setPreferredSubjects(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Emergency Contact Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Jane Doe"
                                        value={emergencyContactName}
                                        onChange={(e) => setEmergencyContactName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Emergency Contact Email</label>
                                    <input
                                        type="email"
                                        placeholder="e.g. janedoe@email.com"
                                        value={emergencyContactEmail}
                                        onChange={(e) => setEmergencyContactEmail(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <div className="button-group">
                            <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button className="cancel-btn" onClick={handleCancelProfile}>Discard Changes</button>
                        </div>
                        {saveSuccess && <p className="success-msg">Changes saved successfully ✅</p>}
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
                            <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button className="cancel-btn" onClick={handleCancelProfile}>Discard Changes</button>
                        </div>
                        {saveSuccess && <p className="success-msg">Changes saved successfully ✅</p>}
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
                            <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button className="cancel-btn" onClick={handleCancelProfile}>Discard Changes</button>
                        </div>
                        {saveSuccess && <p className="success-msg">Changes saved successfully ✅</p>}
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
                            <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button className="cancel-btn" onClick={handleCancelProfile}>Discard Changes</button>
                        </div>
                        {saveSuccess && <p className="success-msg">Changes saved successfully ✅</p>}
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
