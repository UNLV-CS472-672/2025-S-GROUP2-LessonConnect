import axios from 'axios';

const QUESTION_API_BASE = 'http://127.0.0.1:8000/lessons/assignments';

const getToken = () => localStorage.getItem('accessToken');

const questionServices = {

    // List all questions for a given assignment & quiz
    getQuestions: async (assignmentId, quizId) => {
        const res = await axios.get(
            `${QUESTION_API_BASE}/${assignmentId}/quiz/${quizId}/questions/`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        return res.data.data;
    },

    // Create a new question for a given assignment & quiz
    createQuestion: async (assignmentId, quizId, payload) => {
        const res = await axios.post(
            `${QUESTION_API_BASE}/${assignmentId}/quiz/${quizId}/questions/create/`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.data.data;
    },

    // Update an existing question
    updateQuestion: async (assignmentId, quizId, questionId, payload) => {
        const res = await axios.put(
            `${QUESTION_API_BASE}/${assignmentId}/quiz/${quizId}/questions/${questionId}/update/`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.data.data;
    },

    // Delete a question
    deleteQuestion: async (assignmentId, quizId, questionId) => {
        await axios.delete(
            `${QUESTION_API_BASE}/${assignmentId}/quiz/${quizId}/questions/${questionId}/delete/`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        return true;
    }
};

export default questionServices;
