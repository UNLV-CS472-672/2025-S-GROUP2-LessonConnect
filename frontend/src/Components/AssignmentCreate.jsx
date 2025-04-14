import { useState } from 'react';
import "../Styles/AssignmentCreate.css";

const AssignmentCreate = () => {
    const [view, setView] = useState('list');

    const assignments = [
        { id: 1, title: 'Math Homework', type: 'HW', deadline: '2025-04-30' },
        { id: 2, title: 'Science Quiz', type: 'QZ', deadline: '2025-05-05' }
    ];

    return (
        <div className="assignment-create_container">
            {view === 'list' && (
                <>
                    <h1 className="assignment-create_header">Assignments</h1>
                    <div className="assignment-create_button-container">
                        <button className="assignment-create_button" onClick={() => setView('create')}>
                            Create New Assignment
                        </button>
                    </div>
                    <table className="assignment-create_table">
                        <thead>
                        <tr>
                            <th className="assignment-create_label">ID</th>
                            <th className="assignment-create_label">Title</th>
                            <th className="assignment-create_label">Type</th>
                            <th className="assignment-create_label">Deadline</th>
                            <th className="assignment-create_label">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {assignments.map((a) => (
                            <tr key={a.id}>
                                <td className="assignment-create_cell">{a.id}</td>
                                <td className="assignment-create_cell">{a.title}</td>
                                <td className="assignment-create_cell">{a.type}</td>
                                <td className="assignment-create_cell">{a.deadline}</td>
                                <td className="assignment-create_cell">
                                    <button className="assignment-create_link" onClick={() => alert('Edit not implemented')}>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}

            {view === 'create' && (
                <div className="assignment-create_form">
                    <h2 className="assignment-create_header">Create Assignment</h2>
                    <form>
                        <input type="text" placeholder="Title" className="assignment-create_input" />
                        <textarea placeholder="Description" className="assignment-create_input" />
                        <select className="assignment-create_input">
                            <option value="EX">Exercises</option>
                            <option value="HW">Homework</option>
                            <option value="QZ">Quiz</option>
                            <option value="TT">Test</option>
                            <option value="EC">Extra Credit</option>
                        </select>
                        <input type="datetime-local" className="assignment-create_input" />
                        <input type="file" className="assignment-create_input" />
                        <input type="number" placeholder="Student ID (optional)" className="assignment-create_input" />
                        <div className="assignment-create_button-container">
                            <button className="assignment-create_button" type="submit">Submit</button>
                            <button className="assignment-create_button" type="button" onClick={() => setView('list')}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AssignmentCreate;
