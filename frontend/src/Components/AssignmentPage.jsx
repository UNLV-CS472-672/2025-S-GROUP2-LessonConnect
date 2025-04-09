import React, { useState, useEffect, useCallback } from "react";
import "../Styles/AssignmentPage.css";
import { Link } from "react-router-dom";
import axios from "axios";

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
    const [activeTab, setActiveTab] = useState("assignments");
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [submittedAssignments, setSubmittedAssignments] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const isPastAssignment = selectedAssignment && selectedAssignment.id >= 5;

    const handleFileChange = (e) => {
        setUploadFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!uploadFile) {
            setUploadStatus("Please select a file before submitting.");
            return;
        }

        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("assignment_id", selectedAssignment.id);

        try {
            const token = localStorage.getItem("accessToken");

            const response = await axios.post("http://127.0.0.1:8000/uploads/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                setSubmittedAssignments((prev) => ({
                    ...prev,
                    [selectedAssignment.id]: true,
                }));

                setUploadStatus("✅ Submitted successfully!");
                fetchUploadedFiles(); // Refresh file list
            } else {
                setUploadStatus("Upload failed.");
            }
        } catch (error) {
            console.error(error);
            setUploadStatus("An error occurred while uploading.");
        }
    };

    const fetchUploadedFiles = useCallback(async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get("http://127.0.0.1:8000/uploads/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === "success") {
                const files = response.data.data;
                setUploadedFiles(files);

                const submitted = {};
                files.forEach((file) => {
                    if (file.assignment_id) {
                        submitted[file.assignment_id] = true;
                    }
                });

                setSubmittedAssignments((prev) => ({ ...prev, ...submitted }));
            }
        } catch (error) {
            console.error("Failed to fetch uploaded files:", error);
        }
    }, []);

    useEffect(() => {
        if (activeTab === "files") {
            fetchUploadedFiles();
        }
    }, [activeTab, fetchUploadedFiles]);

    return (
        <div className={`assignment-container ${darkMode ? "dark-mode" : ""}`}>
            <aside className="sidebar">
                <h3 className="term-header text-center">2025 Spring</h3>
                <div className="home-icon-wrapper">
                    <Link to="/StudentView" className="home-icon-link" title="Home">
                        <i className="bi bi-house-door-fill"></i>
                    </Link>
                </div>
                <nav>
                    <ul>
                        <li>
                            <button
                                className={`nav-link ${activeTab === "assignments" ? "active" : ""}`}
                                onClick={() => {
                                    setActiveTab("assignments");
                                    setSelectedAssignment(null);
                                }}
                            >
                                Assignments
                            </button>
                        </li>
                        <li>
                            <button
                                className={`nav-link ${activeTab === "files" ? "active" : ""}`}
                                onClick={() => {
                                    setActiveTab("files");
                                    setSelectedAssignment(null);
                                }}
                            >
                                Files
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="assignment-content">
                {activeTab === "assignments" && !selectedAssignment && (
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
                                        setUploadStatus("");
                                    }}
                                >
                                    <strong>{item.title}</strong>
                                    <p>Due: {item.due} | Points: {item.points}</p>
                                    <p>Status: {submittedAssignments[item.id] ? "Submitted" : item.status}</p>
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
                                        setUploadStatus("");
                                    }}
                                >
                                    <strong>{item.title}</strong>
                                    <p>Due: {item.due} | Points: {item.points}</p>
                                    <p>Status: {submittedAssignments[item.id] ? "Submitted" : item.status}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === "assignments" && selectedAssignment && (
                    <div className="assignment-detail-card">
                        <button onClick={() => setSelectedAssignment(null)} className="back-button">
                            ← Back to Assignments
                        </button>
                        <h2>{selectedAssignment.title}</h2>

                        {!startAssignment && !isPastAssignment && (
                            <button className="start-btn" onClick={() => setStartAssignment(true)}>
                                {submittedAssignments[selectedAssignment.id] ? "Resubmit Assignment" : "Start Assignment"}
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
                                <input type="file" className="file-input" onChange={handleFileChange} />
                                <textarea placeholder="Comments..." className="comment-box" rows="4"></textarea>
                                <div className="button-group">
                                    <button onClick={() => setStartAssignment(false)} className="cancel-btn">
                                        Cancel
                                    </button>
                                    <button className="start-btn" onClick={handleSubmit}>
                                        Submit Assignment
                                    </button>
                                </div>
                                {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "files" && (
                    <>
                        <h2>📁 Files</h2>
                        <table className="files-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date Created</th>
                                <th>Date Modified</th>
                                <th>Modified By</th>
                                <th>Size</th>
                            </tr>
                            </thead>
                            <tbody>
                            {uploadedFiles.map((file, index) => (
                                <tr key={index}>
                                    <td style={{ padding: "0.8rem 0" }}>
                                        <a
                                            href={`https://res.cloudinary.com/your-cloud-name/image/upload/${file.cloudinary_public_id}.${file.file_format}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="file-link"
                                        >
                                            <i className="bi bi-file-earmark-text" style={{ marginRight: "8px" }}></i>
                                            {file.file_name}
                                        </a>
                                    </td>
                                    <td>--</td>
                                    <td>--</td>
                                    <td>--</td>
                                    <td>--</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                )}
            </main>
        </div>
    );
}
