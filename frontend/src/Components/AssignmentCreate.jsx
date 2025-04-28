import { useState, useEffect } from 'react';
import assignmentService from '../Services/AssignmentServices.js';
import quizService from '../Services/QuizServices.js';
import questionService from '../Services/QuestionServices.js';
import choiceService from '../Services/ChoiceServices.js';
import '../Styles/AssignmentCreate.css';

export default function AssignmentCreate() {
    const [view, setView] = useState('list');
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', assignment_type: 'HW', deadline: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    //
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizForm, setQuizForm] = useState({
        time_limit: 0, num_of_questions: 0, attempts: 1, is_active: true});
    //
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [questionForm, setQuestionForm] = useState({
        question_type: 'MC', order_of_question: 1, question_text: '', points: 0});
    const [choices, setChoices] = useState([{ text: '', isCorrect: false }]);

    // const [questionType, setQuestionType] = useState('MC');
    // const [choices, setChoices] = useState([{ text: '', isCorrect: false }]);
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

    // Quiz 4)  Create or Load quiz (with assignmentId)
    const handleLoadOrCreateQuiz = async (assignmentId) => {
        setLoading(true);
        try {
            setSelectedAssignment(assignmentId);
            let list = await quizService.getQuizzes(assignmentId);
            if (list.length === 0) {
                // create a new quiz with default values
                const defaults = {
                    time_limit: 0,
                    num_of_questions: 1,
                    attempts: 1,
                    is_active: false
                };
                const newQuiz = await quizService.createQuiz(assignmentId, defaults);
                list = [newQuiz];
            }
            setQuizzes(list);
            setSelectedQuiz(list[0].id);

            setQuizForm({
                time_limit: list[0].time_limit,
                num_of_questions: list[0].num_of_questions,
                attempts: list[0].attempts,
                is_active: list[0].is_active
            });
            setView('quiz');
            setError(null);
        } catch (e) {
            setError('Failed to load or create quiz');
        } finally {
            setLoading(false);
        }
    };

    // Question 1) Fetch questions for a quiz
    const fetchQuestions = async (assignmentId, quizId) => {
        setLoading(true);
        try {
            const data = await questionService.getQuestions(assignmentId, quizId);
            setQuestions(data);
            setError(null);
        } catch {
            setError('Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    // Question 2) Called when "Add Question" clicked
    const handleStartAddQuestion = () => {
        setSelectedQuestion(null);
        setQuestionForm({ question_type: 'MC', order_of_question: '', question_text: '', points: ''});
        setChoices([{ text: '', isCorrect: false }]);
        setView('editQuestion');
    };

    // Question & Choice 3) Called when "Edit" clicked for an existing question
    const handleStartEditQuestion = async (q) => {
        setSelectedQuestion(q.id);
        setQuestionForm({
            question_type: q.question_type,
            order_of_question: q.order_of_question,
            question_text: q.question_text,
            points: q.points
        });
        setChoices([{ text: '', isCorrect: false }]);  // default

        setLoading(true);
        // then load real choices:
        try {
            // Fetch the real choices from the server
            const data = await choiceService.getChoices(
                selectedAssignment,
                selectedQuiz,
                q.id
            );

            setChoices(data.map(c => ({ id: c.id, text: c.choice_text, isCorrect: c.is_correct })));
            setError(null);
        } catch {
            setError('Failed to load choices');
        } finally {
            setLoading(false);
        }

        setView('editQuestion');
    };

    // Question 4) Handle form changes
    const handleQuestionChange = (e) => {
        const { name, value } = e.target;
        let newVal = value;

        // if it’s a number field, keep '' or parseInt
        if (name === 'order_of_question' || name === 'points') {
            newVal = value === '' ? '' : parseInt(value, 10);
        }

        setQuestionForm(prev => ({
            ...prev,
            [name]: newVal
        }));
    };

    // Question & Choice 5) Submit create or update
    const handleSubmitQuestion = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let saved;
            if (selectedQuestion) {
                saved = await questionService.updateQuestion(
                    selectedAssignment,
                    selectedQuiz,
                    selectedQuestion,
                    questionForm
                );
            } else {
                saved = await questionService.createQuestion(
                    selectedAssignment,
                    selectedQuiz,
                    questionForm
                );
                setSelectedQuestion(saved.id);
            }

            // now send choices array:
            // mapping local `choices` state to the DRF payload shape:
            const payload = choices.map(c => ({
                id:        c.id,            // undefined for new ones
                choice_text: c.text,
                is_correct:  c.isCorrect
            }));

            if (payload.length) {
                if (saved.id && payload.some(c => c.id)) {
                    // existing + new → do a bulk update (and new will be ignored server‐side if id is missing)
                    await choiceService.updateChoices(
                        selectedAssignment,
                        selectedQuiz,
                        saved.id,
                        payload
                    );
                } else {
                    // all new
                    await choiceService.createChoices(
                        selectedAssignment,
                        selectedQuiz,
                        saved.id,
                        payload
                    );
                }
            }

            await fetchQuestions(selectedAssignment, selectedQuiz);
            setView('question');
            setError(null);
        } catch {
            setError('Failed to save question & choices');
        } finally {
            setLoading(false);
        }
    };

    // Question 6) Delete a question
    const handleDeleteQuestion = async (id) => {
        if (!window.confirm('Delete this question?')) return;
        await questionService.deleteQuestion(
            selectedAssignment,
            selectedQuiz,
            id
        );
        fetchQuestions(selectedAssignment, selectedQuiz);
        // missing setView('question') ???
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
                                        onClick={() => handleLoadOrCreateQuiz(a.id)}
                                    >
                                        View/Manage Quiz
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
                                        onClick={() => {
                                            setSelectedQuiz(qz.id);
                                            fetchQuestions(selectedAssignment, qz.id);
                                            setView('question')
                                        }}
                                    >
                                        Manage Questions
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
                <>
                    <h2 className="assignment-create_header">Quiz Questions</h2>
                    <div className="assignment-create_button-container">
                        <button
                            className="assignment-create_button"
                            onClick={handleStartAddQuestion}
                        >
                            Add Question
                        </button>
                    </div>
                    <table className="assignment-create_table">
                        <thead>
                        <tr>
                            <th className="assignment-create_label">#</th>
                            <th className="assignment-create_label">Question Type</th>
                            <th className="assignment-create_label">Points</th>
                            <th className="assignment-create_label">Question</th>
                            <th className="assignment-create_label">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {questions.map((q) => (
                            <tr key={q.id}>
                                <td className="assignment-create_cell">{q.order_of_question}</td>
                                <td className="assignment-create_cell">{q.question_type}</td>
                                <td className="assignment-create_cell">{q.points}</td>
                                <td className="assignment-create_cell">{
                                    q.question_text.length > 50
                                        ? q.question_text.slice(0, 50) + '...' : q.question_text
                                }</td>
                                <td className="assignment-create_cell">
                                    <button
                                        className="assignment-create_link"
                                        onClick={() => handleStartEditQuestion(q)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="assignment-create_link"
                                        style={{ color: 'red' }}
                                        onClick={() => handleDeleteQuestion(q.id)}
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

            {view === 'editQuestion' && (
                <div className="assignment-create_form">
                    <h2 className="assignment-create_header">
                        {selectedQuestion ? 'Edit Question' : 'Create/Add Question'}
                    </h2>
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={handleSubmitQuestion}>
                        <select
                            name="question_type"
                            className="assignment-create_input"
                            value={questionForm.question_type}
                            onChange={handleQuestionChange}
                        >
                            <option value="MC">Multiple Choice</option>
                            <option value="SA">Short Answer</option>
                        </select>
                        <input
                            name="order_of_question"
                            type="number"
                            min="1"
                            placeholder="Question Order"
                            className="assignment-create_input"
                            value={questionForm.order_of_question}
                            onChange={handleQuestionChange}
                        />
                        <textarea
                            name="question_text"
                            className="assignment-create_input"
                            placeholder="Question Text"
                            value={questionForm.question_text}
                            onChange={handleQuestionChange}
                        />
                        <input
                            name="points"
                            type="number"
                            min="0"
                            placeholder="Points"
                            className="assignment-create_input"
                            value={questionForm.points}
                            onChange={handleQuestionChange}
                        />

                        {questionForm.question_type === 'MC' && (
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
                            {questionForm.question_type === 'MC' && (
                                <button
                                    type="button"
                                    className="assignment-create_button"
                                    onClick={() => setChoices([...choices, { text: '', isCorrect: false }])}
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
                                onClick={() => setView('question')}
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
