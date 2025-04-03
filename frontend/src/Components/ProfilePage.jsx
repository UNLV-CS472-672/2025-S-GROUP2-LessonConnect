import "../Styles/ProfilePage.css"
import userIcon from "/assets/images/UNLV_pic.png";
import {useState} from "react";
import badge1 from "/assets/images/UNLV_pic.png";
import badge2 from "/assets/images/UNLV_pic.png";
import badge3 from "/assets/images/UNLV_pic.png";
import badge4 from "/assets/images/UNLV_pic.png";

export default function ProfilePage() {
    const [status, setStatus] = useState("Excited to build awesome web apps!");
    const [newStatus, setNewStatus] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const badges = [
        { id: 1, name: "Master Explorer", image: badge1 },
        { id: 2, name: "Speed Runner", image: badge2 },
        { id: 3, name: "Legendary Warrior", image: badge3 },
        { id: 4, name: "Puzzle Genius", image: badge4 },
    ];

    const updateStatus = () => {
        if (newStatus.trim() !== "") {
            setStatus(newStatus);
        }

            setNewStatus("");
            setIsEditing(false);
    };

    return (
        <>
            <div className="profile-page-container">
                <div className="profile-page">
                    {/* Cover Section */}
                    <div className="cover-section"></div>
                    {/* Profile Content */}
                    <div className="profile-content">
                            <div className="row w-75">
                                    <div className="card py-4">
                                        <div className="text-center">
                                            <img src={userIcon} width="100" className="rounded-circle"></img>
                                        </div>
                                        <div className="text-center mt-3">
                                            <h5 className="mt-2 mb-0">John Doe</h5>
                                            <span>UI/UX Designer</span>
                                            <div className="px-4 mt-1">
                                                <p className="fonts">Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>

                                            </div>
                                            <div className="buttons">
                                                <button className="btn btn-outline-primary px-4">Message</button>
                                                <button className="btn btn-primary px-4 ms-3">Contact</button>
                                            </div>
                                        </div>
                                    </div>
                                {/*Badges Section*/}
                                <div className="profile-panel badges-section">
                                    <h4>🏆 Badges Earned</h4>
                                    <div className="badges-grid">
                                        {badges.map((badge) => (
                                            <div key={badge.id} className="badge">
                                                <img src={badge.image} alt={badge.name} className="badge-image" />
                                                <p className="badge-name">{badge.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        <div className="row">
                        {/* Custom Status Section */}
                        <div className="profile-panel status-section">
                            <h4>Custom Status</h4>
                            {isEditing ? (
                                <>
              <textarea
                  className="status-input"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  placeholder="What's on your mind?"
              ></textarea>
                                    <button className="btn btn-success" onClick={updateStatus}>
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <div className="status-display" onClick={() => setIsEditing(true)}>
                                    {status || "Click here to update your status..."}
                                </div>
                            )}
                        </div>
                        {/* {/* Additional Panel
                        <div className="profile-panel">
                            <h4>About Me</h4>
                            <p>
                                Developer with a love for React, Node.js, and clean UI design.
                                Always eager to learn and collaborate.
                            </p>
                        </div>
                        */}
                        {/* Activity Section */}
                        <div className="profile-panel activity-section">
                            <h4>Recent Activity</h4>
                            <ul>
                                <li>Completed React project</li>
                                <li>Earned a new badge</li>
                                <li>Joined a new study group</li>
                            </ul>
                        </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
