import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/lessons/assignments';

const getToken = () => localStorage.getItem('accessToken');

const solutionService = {

    getSolution: async (assignmentId, quizId, questionId) => {
        const res = await axios.get(
            `${API_BASE}/${assignmentId}/quiz/${quizId}/questions/${questionId}/solution/`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        return res.data.data;
    },

    createSolution: async (assignmentId, quizId, questionId, payload) => {
        const res = await axios.post(
            `${API_BASE}/${assignmentId}/quiz/${quizId}/questions/${questionId}/solution/create/`,
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

    updateSolution: async (assignmentId, quizId, questionId, payload) => {
        const res = await axios.put(
            `${API_BASE}/${assignmentId}/quiz/${quizId}/questions/${questionId}/solution/update/`,
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

    deleteSolution: async (assignmentId, quizId, questionId) => {
        await axios.delete(
            `${API_BASE}/${assignmentId}/quiz/${quizId}/questions/${questionId}/solution/delete/`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        return true;
    }
};

export default solutionService;
