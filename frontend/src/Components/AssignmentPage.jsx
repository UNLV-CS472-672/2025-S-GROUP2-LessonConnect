import React, { useState } from "react";
import "../Styles/AssignmentPage.css";
import { Link } from "react-router-dom"; // Make sure this is at the top


const upcomingAssignments = [
    {
        id: 1,
        title: "Assignment 1",
        due: "Apr 14 at 11:59pm",
        points: 100,
        status: "Not Yet Graded",
        submitting: "a file upload",
        fileTypes: "pdf",
        available: "until Apr 14 at 11:59pm",
        details: "",
    },
    {
        id: 2,
        title: "Assignment 2",
        due: "Apr 21 at 11:59pm",
        points: 15,
        status: "Not Yet Graded",
        submitting: "a file upload",
        fileTypes: "pdf",
        available: "until Apr 21 at 11:59pm",
        details: "",
    },
    {
        id: 3,
        title: "Quiz 1",
        due: "Apr 29 at 11:59pm",
        points: 100,
        status: "Not Available Until Apr 7 at 4:30pm",
        submitting: "a quiz",
        fileTypes: "N/A",
        available: "until Apr 29 at 11:59pm",
        details: "Not available until Apr 7 at 4:30pm.",
    },
    {
        id: 4,
        title: "Assignment 3",
        due: "May 1 at 11:59pm",
        points: 20,
        status: "Not Yet Graded",
        submitting: "a file upload",
        fileTypes: "pdf",
        available: "until May 1 at 11:59pm",
        details: "",
    },
];

const pastAssignments = [
    {
        id: 5,
        title: "Attendance Check #1",
        due: "Mar 12 at 3:05pm",
        points: 1,
        status: "Submitted",
        submitting: "a file upload",
        fileTypes: "pdf",
        available: "N/A",
        details: "Attendance submission completed.",
    },
    {
        id: 6,
        title: "Attendance Check #2",
        due: "Apr 2 at 3:05pm",
        points: 1,
        status: "Submitted",
        submitting: "a file upload",
        fileTypes: "pdf",
        available: "N/A",
        details: "Attendance submitted.",
    },
    {
        id: 7,
        title: "Midterm Exam",
        due: "Mar 13 at 6:59pm",
        points: 80,
        status: "Graded (75/80)",
        submitting: "online exam",
        fileTypes: "N/A",
        available: "N/A",
        details: "Closed graded exam.",
    },
];

export default function AssignmentPage({ darkMode }) {
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [startAssignment, setStartAssignment] = useState(false);

    const isPastAssignment = selectedAssignment && selectedAssignment.id >= 5;

    return (
        <div className={`assignment-container ${darkMode ? "dark-mode" : ""}`}>
            {/* Sidebar */}
            <aside className="sidebar">
                {/* Home Icon Link */}
                <h3 className="term-header text-center">2025 Spring</h3>

                <div className="home-icon-wrapper">
                    <Link to="/StudentView" className="home-icon-link" title="Home">
                        <i className="bi bi-house-door-fill"></i>
                    </Link>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/student/assignment" className="nav-link active">Assignments</Link>
                        </li>
                        <li>
                            <Link to="/student/files" className="nav-link">Files</Link>
                        </li>
                        <li>
                            <Link to="/student/grades" className="nav-link">Grades</Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="assignment-content">
                {!selectedAssignment ? (
                    <>
                        <h2>📚 Assignments</h2>

                        <div className="assignment-section">
                            <h3>Upcoming Assignments</h3>
                            {upcomingAssignments.map((item) => (
                                <div
                                    key={item.id}
                                    className="assignment-card"
                                    onClick={() => {
                                        setSelectedAssignment(item);
                                        setStartAssignment(false);
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <strong>{item.title}</strong>
                                    <p>Due: {item.due} | Points: {item.points}</p>
                                    <p>Status: {item.status}</p>
                                </div>
                            ))}
                        </div>

                        <div className="assignment-section">
                            <h3>Past Assignments</h3>
                            {pastAssignments.map((item) => (
                                <div
                                    key={item.id}
                                    className="assignment-card past"
                                    onClick={() => {
                                        setSelectedAssignment(item);
                                        setStartAssignment(false);
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <strong>{item.title}</strong>
                                    <p>Due: {item.due} | Points: {item.points}</p>
                                    <p>Status: {item.status}</p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="assignment-detail-card">
                        <button onClick={() => setSelectedAssignment(null)} className="back-button">
                            ← Back to Assignments
                        </button>
                        <h2>{selectedAssignment.title}</h2>

                        {!startAssignment && !isPastAssignment && (
                            <button
                                className="start-btn"
                                onClick={() => setStartAssignment(true)}
                            >
                                Start Assignment
                            </button>
                        )}

                        <hr />
                        <p><strong>Due</strong> {selectedAssignment.due}</p>
                        <p><strong>Points</strong> {selectedAssignment.points}</p>
                        <p><strong>Submitting</strong> {selectedAssignment.submitting}</p>
                        <p><strong>File Types</strong> {selectedAssignment.fileTypes}</p>
                        <p><strong>Available</strong> {selectedAssignment.available}</p>
                        <hr />
                        <p>{selectedAssignment.details || "No additional details were added for this assignment."}</p>

                        {startAssignment && (
                            <div className="upload-section">
                                <label className="upload-label">
                                    🚀 Drag a file here, or <strong>Choose a file to upload</strong>
                                </label>
                                <input type="file" className="file-input" />

                                <textarea
                                    placeholder="Comments..."
                                    className="comment-box"
                                    rows="4"
                                ></textarea>

                                <div className="button-group">
                                    <button
                                        onClick={() => setStartAssignment(false)}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                    <button className="start-btn">Submit Assignment</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
