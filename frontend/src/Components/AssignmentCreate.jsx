import { useState, useEffect } from 'react';
import assignmentService from '../Services/AssignmentServices.js';
import '../Styles/AssignmentCreate.css';

export default function AssignmentCreate() {
    const [view, setView] = useState('list');
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', assignment_type: 'HW', deadline: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const [questionType, setQuestionType] = useState('MC');
    // const [choices, setChoices] = useState([{ text: '', isCorrect: false }]);
    // const [selectedQuestion, setSelectedQuestion] = useState(null);
    // const [solutionText, setSolutionText] = useState('');

    // 1) Fetch list on mount & refresh
    const fetchList = async () => {
        setLoading(true);
        try {
            const data = await assignmentService.getAssignments();
            setAssignments(data);
            setError(null);
        } catch (e) {
            setError('Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchList(); }, []);

    // 2) When "Edit" is clicked
    const startEdit = async (id) => {
        setLoading(true);
        const data = await assignmentService.getAssignment(id);
        setFormData({
            title: data.title,
            description: data.description,
            assignment_type: data.assignment_type,
            deadline: data.deadline?.slice(0,16)  // format for datetime-local
        });
        setSelectedAssignment(id);
        setView('create');
        setLoading(false);
    };

    // 3) Handle form field changes
    const handleChange = (e) =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    // 4) Submit create or update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (selectedAssignment) {
                await assignmentService.updateAssignment(selectedAssignment, formData);
            } else {
                await assignmentService.createAssignment(formData);
            }
            await fetchList();
            setView('list');
            setSelectedAssignment(null);
            setFormData({ title: '', description: '', assignment_type: 'HW', deadline: '' });
        } catch (e) {
            setError('Submit failed');
        } finally {
            setLoading(false);
        }
    };

    // 5) Delete
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this assignment?')) return;
        await assignmentService.deleteAssignment(id);
        fetchList();
    };

    /*
    const [questions, setQuestions] = useState([
        { id: 1, type: 'MC', text: 'What is 2 + 2?', points: 1, solution: 4 },
        { id: 2, type: 'SA', text: 'Define gravity.', points: 2, solution: '' },
    ]);

    const handleAddChoice = () => {
        setChoices([...choices, { text: '', isCorrect: false }]);
    };

    const handleDeleteAssignment = (id) => {
        setAssignments(assignments.filter(a => a.id !== id));
    };

    const handleSaveSolution = () => {
        setQuestions(prev =>
            prev.map(q =>
                q.id === selectedQuestion.id
                    ? { ...q, solution: solutionText }
                    : q
            )
        );
        setSelectedQuestion(null);
        setSolutionText('');
        setView('quiz');
    };
    */

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
                                setFormData({ title:'',description:'',assignment_type:'HW',deadline:'' });
                                setView('create');
                            }}
                        >
                            Create New Assignment
                        </button>
                    </div>
                    {loading && <p>Loading…</p>}
                    {error && <p className="error">{error}</p>}
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
                                <td className="assignment-create_cell">{a.assignment_type}</td>
                                <td className="assignment-create_cell">{new Date(a.deadline).toLocaleString()}</td>
                                <td className="assignment-create_cell">
                                    <button
                                        className="assignment-create_link"
                                        onClick={() => startEdit(a.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="assignment-create_link"
                                        onClick={() => setView('quiz')}
                                    >
                                        View Quiz
                                    </button>
                                    <button
                                        className="assignment-create_link"
                                        style={{ color: 'red' }}
                                        onClick={() => handleDelete(a.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}

            {(view === 'create') && (
                <div className="assignment-create_form">
                    <h2 className="assignment-create_header">
                        {selectedAssignment ? 'Edit Assignment' : 'Create Assignment'}
                    </h2>
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <input
                            name="title"
                            placeholder="Assignment Title"
                            type="text"
                            className="assignment-create_input"
                            value={formData.title}
                            onChange={handleChange}
                            //defaultValue={selectedAssignment?.title || ''}
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            className="assignment-create_input"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        <select
                            name="assignment_type"
                            className="assignment-create_input"
                            value={formData.assignment_type}
                            onChange={handleChange}
                            //defaultValue={selectedAssignment?.type || 'HW'}
                        >
                            <option value="EX">Exercises</option>
                            <option value="HW">Homework</option>
                            <option value="QZ">Quiz</option>
                            <option value="TT">Test</option>
                            <option value="EC">Extra Credit</option>
                        </select>
                        <input
                            name="deadline"
                            type="datetime-local"
                            className="assignment-create_input"
                            value={formData.deadline}
                            onChange={handleChange}
                        />
                        <input type="file" className="assignment-create_input" />
                        <input
                            placeholder="Student ID (optional)"
                            type="text"
                            className="assignment-create_input"
                            pattern="\d*"
                        />
                        <div className="assignment-create_button-container">
                            <button
                                className="assignment-create_button"
                                type="submit"
                            >
                                {selectedAssignment ? 'Update' : 'Submit'}
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
                            <th className="assignment-create_label">Solution</th>
                        </tr>
                        </thead>
                        <tbody>
                        {questions.map((q) => (
                            <tr key={q.id}>
                                <td className="assignment-create_cell">{q.id}</td>
                                <td className="assignment-create_cell">{q.type}</td>
                                <td className="assignment-create_cell">{q.points}</td>
                                <td className="assignment-create_cell">{q.text}</td>
                                <td className="assignment-create_cell">
                                    {q.solution ? (
                                        q.solution
                                    ) : (
                                        <button
                                            className="assignment-create_link"
                                            onClick={() => {
                                                setSelectedQuestion(q);
                                                setView('solution');
                                            }}
                                        >
                                            Add Solution
                                        </button>
                                    )}
                                </td>
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
                                    <div
                                        key={index}
                                        className="assignment-create_input"
                                        style={{
                                            display: 'flex',
                                            gap: '10px',
                                            marginBottom: '10px',
                                        }}
                                    >
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
                            </>
                        )}
                        <div className="assignment-create_button-container">
                            {questionType === 'MC' && (
                                <button
                                    type="button"
                                    className="assignment-create_button"
                                    onClick={handleAddChoice}
                                >
                                    Add Another Choice
                                </button>
                            )}
                            <button className="assignment-create_button" type="submit">
                                Submit
                            </button>
                            <button
                                className="assignment-create_button"
                                type="button"
                                onClick={() => setView('quiz')}
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
            )}

            {view === 'solution' && selectedQuestion && (
                <div className="assignment-create_form">
                    <h2 className="assignment-create_header">Add Solution</h2>
                    <form>
                        <textarea
                            placeholder="Enter solution..."
                            className="assignment-create_input"
                            value={solutionText}
                            onChange={(e) => setSolutionText(e.target.value)}
                        />
                        <div className="assignment-create_button-container">
                            <button
                                className="assignment-create_button"
                                type="button"
                                onClick={handleSaveSolution}
                            >
                                Save Solution
                            </button>
                            <button
                                className="assignment-create_button"
                                type="button"
                                onClick={() => {
                                    setSelectedQuestion(null);
                                    setSolutionText('');
                                    setView('quiz');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
