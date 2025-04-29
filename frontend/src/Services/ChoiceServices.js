import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/lessons/assignments';

const getToken = () => localStorage.getItem('accessToken');

const choiceService = {

    getChoices: async (assignmentId, quizId, questionId) => {
        const res = await axios.get(
            `${API_BASE}/${assignmentId}/quiz/${quizId}/questions/${questionId}/choices/`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        return res.data.data;
    },

    createChoices: async (assignmentId, quizId, questionId, choices) => {
        const res = await axios.post(
            `${API_BASE}/${assignmentId}/quiz/${quizId}/questions/${questionId}/choices/create/`,
            { choices },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.data.data;
    },

    updateChoices: async (assignmentId, quizId, questionId, choices) => {
        const res = await axios.put(
            `${API_BASE}/${assignmentId}/quiz/${quizId}/questions/${questionId}/choices/update/`,
            { choices },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.data.data;
    },

    deleteChoices: async (assignmentId, quizId, questionId) => {
        await axios.delete(
            `${API_BASE}/${assignmentId}/quiz/${quizId}/questions/${questionId}/choices/delete/`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        return true;
    }
};

export default choiceService;
