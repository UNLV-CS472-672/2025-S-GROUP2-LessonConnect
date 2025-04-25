import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/lessons/assignments';

const getToken = () => localStorage.getItem('accessToken');

const quizServices = {

    // List all quizzes for a given assignment
    getQuizzes: async (assignmentId) => {
        const response = await axios.get(
            `${API_BASE}/${assignmentId}/quizzes/`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        return response.data.data;
    },

    // Retrieve a single quiz
    getQuiz: async (assignmentId, quizId) => {
        const response = await axios.get(
            `${API_BASE}/${assignmentId}/quiz/${quizId}/`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        return response.data.data;
    },

    // Create a new quiz under an assignment
    createQuiz: async (assignmentId, payload) => {
        const response = await axios.post(
            `${API_BASE}/${assignmentId}/quizzes/`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.data;
    },

    // Update an existing quiz
    updateQuiz: async (assignmentId, quizId, payload) => {
        const response = await axios.patch(
            `${API_BASE}/${assignmentId}/quiz/${quizId}/`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.data;
    },

    // Delete a quiz
    deleteQuiz: async (assignmentId, quizId) => {
        await axios.delete(
            `${API_BASE}/${assignmentId}/quiz/${quizId}/`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        return true;
    }
};

export default quizServices;
