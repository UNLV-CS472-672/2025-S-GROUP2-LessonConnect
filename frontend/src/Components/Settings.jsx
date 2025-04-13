import React, { useState } from "react";
import "../Styles/Settings.css";

export default function Settings() {
    const [activePanel, setActivePanel] = useState("profile");

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
                            <input type="text" placeholder="Enter your full name" />
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
                            <textarea placeholder="Tell us a little bit about yourself..." />
                            <p className="helper-text">You can include links.</p>
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
                        <button className="save-btn">Save</button>
                    </div>
                );

            case "account":
                return (
                    <div className="settings-panel-section">
                        <h2>Account Settings</h2>

                        <div className="form-group">
                            <label>Change Username</label>
                            <input type="text" placeholder="johnDoe123" />
                            <p className="helper-text">This is your unique handle across the platform.</p>
                            <button className="save-btn">Change Username</button>
                        </div>

                        <hr />

                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" placeholder="Las Vegas, NV" />
                            <p className="helper-text">Share your city or region for better connection suggestions.</p>
                        </div>

                        <div className="form-group">
                            <label>Occupation</label>
                            <input type="text" placeholder="e.g. Computer Science Student" />
                            <p className="helper-text">Helps others understand your background.</p>
                        </div>

                        <div className="form-group">
                            <label>Discord</label>
                            <input type="text" placeholder="johnDoe#4567" />
                            <p className="helper-text">Used for quick messaging and support.</p>
                        </div>

                        <div className="form-group">
                            <label>GitHub</label>
                            <input type="text" placeholder="https://github.com/johnDoe" />
                            <p className="helper-text">Showcase your projects and repositories.</p>
                            <button className="save-btn">Save</button>
                        </div>
                    </div>

                );
            case "email":
                return (
                    <div className="settings-panel-section">
                        <h2>Email Settings</h2>

                        <div className="form-group">
                            <label>Primary Email</label>
                            <input type="email" placeholder="your@email.com" />
                            <p className="helper-text">Used for login and notifications.</p>
                            <button className="save-btn">Save</button>
                        </div>

                        <div className="form-group">
                            <label>Backup Email</label>
                            <input type="email" placeholder="backup@email.com" />
                            <p className="helper-text">Fallback for password recovery and alerts.</p>
                            <button className="save-btn">Save</button>
                        </div>
                    </div>
                );

            case "security":

            default:

        }
    };

    return (
        <div className="settings-wrapper">
            {/* Top Profile Header */}
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
                {/* Sidebar Menu */}
                <div className="settings-menu">
                    <div
                        className={`menu-item ${activePanel === "profile" ? "active" : ""}`}
                        onClick={() => setActivePanel("profile")}
                    >
                        Public Profile
                    </div>
                    <div
                        className={`menu-item ${activePanel === "account" ? "active" : ""}`}
                        onClick={() => setActivePanel("account")}
                    >
                        Account
                    </div>
                    <div
                        className={`menu-item ${activePanel === "email" ? "active" : ""}`}
                        onClick={() => setActivePanel("email")}
                    >
                        Emails
                    </div>
                    <div
                        className={`menu-item ${activePanel === "security" ? "active" : ""}`}
                        onClick={() => setActivePanel("security")}
                    >
                        Password & Security
                    </div>
                </div>

                {/* Main Panel */}
                <div className="settings-panel">{renderPanel()}</div>
            </div>
        </div>
    );
}
