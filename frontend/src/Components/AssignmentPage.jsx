import React from "react";
import "../Styles/AssignmentPage.css";
import { Link } from "react-router-dom";

const upcomingAssignments = [
    {
        title: "Assignment 1",
        due: "Apr 14 at 11:59pm",
        points: 100,
        status: "Not Yet Graded",
    },
    {
        title: "Assignment 2",
        due: "Apr 21 at 11:59pm",
        points: 15,
        status: "Not Yet Graded",
    },
    {
        title: "Quiz 1",
        due: "Apr 29 at 11:59pm",
        points: 100,
        status: "Not Available Until Apr 7 at 4:30pm",
    },
    {
        title: "Assignment 3",
        due: "May 1 at 11:59pm",
        points: 20,
        status: "Not Yet Graded",
    },
];

const pastAssignments = [
    {
        title: "Attendance Check #1",
        due: "Mar 12 at 3:05pm",
        points: 1,
        status: "Submitted",
    },
    {
        title: "Attendance Check #2",
        due: "Apr 2 at 3:05pm",
        points: 1,
        status: "Submitted",
    },
    {
        title: "Midterm Exam",
        due: "Mar 13 at 6:59pm",
        points: 80,
        status: "Graded (75/80)",
    },
];

export default function AssignmentPage() {
    return (
        <div className="assignment-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <h3 className="term-header">2025 Spring</h3>
                <nav>
                    <ul>
                        <li><Link to="/student/home">Home</Link></li>
                        <li><Link to="/student/assignment" className="active">Assignments</Link></li>
                        <li><Link to="/student/files">Files</Link></li>
                        <li><Link to="/student/grades">Grades</Link></li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="assignment-content">
                <h2>📚 Assignments</h2>

                {/* Upcoming */}
                <div className="assignment-section">
                    <h3>Upcoming Assignments</h3>
                    {upcomingAssignments.map((item, idx) => (
                        <div key={idx} className="assignment-card">
                            <strong>{item.title}</strong>
                            <p>Due: {item.due} | Points: {item.points}</p>
                            <p>Status: {item.status}</p>
                        </div>
                    ))}
                </div>

                {/* Past */}
                <div className="assignment-section">
                    <h3>Past Assignments</h3>
                    {pastAssignments.map((item, idx) => (
                        <div key={idx} className="assignment-card past">
                            <strong>{item.title}</strong>
                            <p>Due: {item.due} | Points: {item.points}</p>
                            <p>Status: {item.status}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
