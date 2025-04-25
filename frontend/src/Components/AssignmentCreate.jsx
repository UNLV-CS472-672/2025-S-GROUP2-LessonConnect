import { useState, useEffect } from 'react';
import assignmentService from '../Services/AssignmentServices.js';
import quizService from "../Services/QuizServices.js";
import '../Styles/AssignmentCreate.css';

export default function AssignmentCreate() {
    const [view, setView] = useState('list');
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', assignment_type: 'HW', deadline: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizForm, setQuizForm] = useState({
        time_limit: 0, num_of_questions: 0, attempts: 1, is_active: true});
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

    // Quiz 1) Fetch quiz
    const fetchQuizzes = async (assignmentId) => {
        setLoading(true);
        try {
            const data = await quizService.getQuizzes(assignmentId);
            setQuizzes(data);
            setError(null);
        } catch (e) {
            setError('Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    };

    // Quiz 2) Handle each form field
    const handleQuizChange = (e) => {
        const { name, value } = e.target;
        setQuizForm(prev => ({...prev,
            [name]: name === 'is_active' ? (value === 'true'): parseInt(value, 10)}));
    };

    // Quiz 3) Submit updated quiz
    const handleSubmitQuiz = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await quizService.updateQuiz(selectedAssignment, selectedQuiz, quizForm);
            await fetchQuizzes(selectedAssignment);
            setView('quiz');
            setError(null);
        } catch {
            setError('Failed to update quiz');
        } finally {
            setLoading(false);
        }
    };

    /*
    const [questions, setQuestions] = useState([
        { id: 1, type: 'MC', text: 'What is 2 + 2?', points: 1, solution: 4 },
        { id: 2, type: 'SA', text: 'Define gravity.', points: 2, solution: '' },
    ]);

    const handleAddChoice = () => {
        setChoices([...choices, { text: '', isCorrect: false }]);
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
                                        onClick={() => {
                                            setSelectedAssignment(a.id);
                                            fetchQuizzes(a.id);
                                            setView('quiz');
                                        }}
                                    >
                                        Manage Quiz
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
                    <h2 className="assignment-create_header">Quiz Info</h2>
                    <div className="assignment-create_button-container">
                        <button
                            className="assignment-create_button"
                            onClick={() => {
                                const qz = quizzes[0];  // assuming one quiz per assignment
                                setSelectedQuiz(qz.id);
                                setQuizForm({
                                    time_limit:       qz.time_limit,
                                    num_of_questions: qz.num_of_questions,
                                    attempts:         qz.attempts,
                                    is_active:        qz.is_active
                                });
                                setView('editQuiz')
                            }}
                        >
                            Edit Quiz
                        </button>
                    </div>
                    <table className="assignment-create_table">
                        <thead>
                        <tr>
                            <th className="assignment-create_label">ID</th>
                            <th className="assignment-create_label">Number of Questions</th>
                            <th className="assignment-create_label">Time Limit (minutes)</th>
                            <th className="assignment-create_label">Attempts</th>
                            <th className="assignment-create_label">Active</th>
                            <th className="assignment-create_label">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {quizzes.map((qz) => (
                            <tr key={qz.id}>
                                <td className="assignment-create_cell">{qz.id}</td>
                                <td className="assignment-create_cell">{qz.num_of_questions}</td>
                                <td className="assignment-create_cell">{qz.time_limit}</td>
                                <td className="assignment-create_cell">{qz.attempts}</td>
                                <td className="assignment-create_cell">{qz.is_active ? 'Yes' : 'No'}</td>
                                <td className="assignment-create_cell">
                                    <button
                                        className="assignment-create_link"
                                        onClick={() => setView('question')}
                                    >
                                        Add Questions
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}

            {view === 'editQuiz' && (
                <div className="assignment-create_form">
                    <h2 className="assignment-create_header">Edit Quiz</h2>
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={handleSubmitQuiz}>
                        <input
                            name="num_of_questions"
                            type="number"
                            min="1"
                            placeholder="Number of Questions"
                            className="assignment-create_input"
                            value={quizForm.num_of_questions}
                            onChange={handleQuizChange}
                        />
                        <input
                            name="time_limit"
                            type="number"
                            min="0"
                            placeholder="Time limit (minutes)"
                            className="assignment-create_input"
                            value={quizForm.time_limit}
                            onChange={handleQuizChange}
                        />
                        <input
                            name="attempts"
                            type="number"
                            min="1"
                            placeholder="Number of Attempts"
                            className="assignment-create_input"
                            value={quizForm.attempts}
                            onChange={handleQuizChange}
                        />
                        <select
                            name="is_active"
                            className="assignment-create_input"
                            value={quizForm.is_active ? 'true' : 'false'}
                            onChange={handleQuizChange}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                        <div className="assignment-create_button-container">
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
