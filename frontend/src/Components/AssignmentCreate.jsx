
import "../Styles/AssignmentCreate.css";

const AssignmentCreate = () => {
    return (
        <div className="global_container">
            <h1 className="global_header">Assignments</h1>

            <div className="global_buttonContainer">
                <button className="global_button">Create New Assignment</button>
            </div>

            <table className="global_table">
                <thead>
                <tr>
                    <th className="global_label">ID</th>
                    <th className="global_label">Title</th>
                    <th className="global_label">Type</th>
                    <th className="global_label">Deadline</th>
                    <th className="global_label">Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="global_cell">1</td>
                    <td className="global_cell">Math Homework</td>
                    <td className="global_cell">HW</td>
                    <td className="global_cell">2025-04-30</td>
                    <td className="global_cell"><button className="global_link">Edit</button></td>
                </tr>
                <tr>
                    <td className="global_cell">2</td>
                    <td className="global_cell">Science Quiz</td>
                    <td className="global_cell">QZ</td>
                    <td className="global_cell">2025-05-05</td>
                    <td className="global_cell"><button className="global_link">Edit</button></td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentCreate;
