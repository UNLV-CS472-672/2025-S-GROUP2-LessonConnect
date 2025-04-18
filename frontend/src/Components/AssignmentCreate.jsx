
import { useState } from 'react';
import '../Styles/AssignmentCreate.css';

const AssignmentCreate = () => {
    const [view, setView] = useState('list');
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [selectedQuizId, setSelectedQuizId] = useState(1); // Mock quiz ID
    const [questionType, setQuestionType] = useState('MC');
    const [choices, setChoices] = useState([{ text: '', isCorrect: false }]);

    const assignments = [
        { id: 1, title: 'Math Homework', type: 'HW', deadline: '2025-04-30' },
        { id: 2, title: 'Science Quiz', type: 'QZ', deadline: '2025-05-05' }
    ];

    const questions = [
        { id: 1, type: 'MC', text: 'What is 2 + 2?', points: 1 },
        { id: 2, type: 'SA', text: 'Define gravity.', points: 2 }
    ];

    const handleAddChoice = () => {
        setChoices([...choices, { text: '', isCorrect: false }]);
    };

    return (
        <div className="assignment-create_container">
            {view === 'list' && (
                <>
                    <h1 className="assignment-create_header">Assignments</h1>
                    <div className="assignment-create_button-container">
                        <button
                            className="assignment-create_button"
                            onClick={() => {
                                setSelectedAssignment(null);
                                setView('create');
                            }}
                        >
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
                                    <button
                                        className="assignment-create_link"
                                        onClick={() => {
                                            setSelectedAssignment(a);
                                            setView('create');
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="assignment-create_link"
                                        onClick={() => setView('quiz')}
                                    >
                                        View Quiz
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}

            {(view === 'create' || view === 'edit') && (
                <div className="assignment-create_form">
                    <h2 className="assignment-create_header">
                        {selectedAssignment ? 'Edit Assignment' : 'Create Assignment'}
                    </h2>
                    <form>
                        <input
                            type="text"
                            placeholder="Title"
                            className="assignment-create_input"
                            defaultValue={selectedAssignment?.title || ''}
                        />
                        <textarea
                            placeholder="Description"
                            className="assignment-create_input"
                        />
                        <select className="assignment-create_input" defaultValue={selectedAssignment?.type || 'HW'}>
                            <option value="EX">Exercises</option>
                            <option value="HW">Homework</option>
                            <option value="QZ">Quiz</option>
                            <option value="TT">Test</option>
                            <option value="EC">Extra Credit</option>
                        </select>
                        <input type="datetime-local" className="assignment-create_input" />
                        <input type="file" className="assignment-create_input" />
                        <input
                            type="number"
                            placeholder="Student ID (optional)"
                            className="assignment-create_input"
                        />
                        <div className="assignment-create_button-container">
                            <button className="assignment-create_button" type="submit">
                                Submit
                            </button>
                            <button
                                className="assignment-create_button"
                                type="button"
                                onClick={() => setView('list')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {view === 'quiz' && (
                <>
                    <h2 className="assignment-create_header">Quiz Questions</h2>
                    <div className="assignment-create_button-container">
                        <button
                            className="assignment-create_button"
                            onClick={() => setView('question')}
                        >
                            Add Question
                        </button>
                    </div>
                    <table className="assignment-create_table">
                        <thead>
                        <tr>
                            <th className="assignment-create_label">#</th>
                            <th className="assignment-create_label">Type</th>
                            <th className="assignment-create_label">Points</th>
                            <th className="assignment-create_label">Question</th>
                        </tr>
                        </thead>
                        <tbody>
                        {questions.map((q) => (
                            <tr key={q.id}>
                                <td className="assignment-create_cell">{q.id}</td>
                                <td className="assignment-create_cell">{q.type}</td>
                                <td className="assignment-create_cell">{q.points}</td>
                                <td className="assignment-create_cell">{q.text}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}

            {view === 'question' && (
                <div className="assignment-create_form">
                    <h2 className="assignment-create_header">Create Question</h2>
                    <form>
                        <select
                            className="assignment-create_input"
                            value={questionType}
                            onChange={(e) => setQuestionType(e.target.value)}
                        >
                            <option value="MC">Multiple Choice</option>
                            <option value="SA">Short Answer</option>
                        </select>
                        <input type="number" placeholder="Order" className="assignment-create_input" />
                        <textarea placeholder="Question Text" className="assignment-create_input" />
                        <input type="number" placeholder="Points" className="assignment-create_input" />
                        {questionType === 'MC' && (
                            <>
                                <h4 style={{ marginTop: '20px' }}>Choices</h4>
                                {choices.map((choice, index) => (
                                    <div key={index} className="assignment-create_input" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <input
                                            type="text"
                                            placeholder={`Choice ${index + 1}`}
                                            value={choice.text}
                                            onChange={(e) => {
                                                const newChoices = [...choices];
                                                newChoices[index].text = e.target.value;
                                                setChoices(newChoices);
                                            }}
                                        />
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={choice.isCorrect}
                                                onChange={(e) => {
                                                    const newChoices = [...choices];
                                                    newChoices[index].isCorrect = e.target.checked;
                                                    setChoices(newChoices);
                                                }}
                                            />
                                            Correct
                                        </label>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="assignment-create_button"
                                    onClick={handleAddChoice}
                                >
                                    Add Another Choice
                                </button>
                            </>
                        )}
                        <div className="assignment-create_button-container">
                            <button className="assignment-create_button" type="submit">Submit</button>
                            <button className="assignment-create_button" type="button" onClick={() => setView('quiz')}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AssignmentCreate;
