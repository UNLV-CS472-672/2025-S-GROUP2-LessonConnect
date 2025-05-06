import axios from 'axios';

const API_BASE = 'https://backend-d54p.onrender.com/lessons/assignments';

const getToken = () => localStorage.getItem('accessToken');

const assignmentService = {
    getAssignments: async () => {
        const response = await axios.get(`${API_BASE}/`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        return response.data.data;
    },

    getAssignment: async (id) => {
        const response = await axios.get(`${API_BASE}/${id}/`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        return response.data.data;
    },

    createAssignment: async (payload) => {
        const response = await axios.post(`${API_BASE}/create/`, payload, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.data;
    },

    updateAssignment: async (id, payload) => {
        const response = await axios.patch(`${API_BASE}/${id}/`, payload, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.data;
    },

    deleteAssignment: async (id) => {
        await axios.delete(`${API_BASE}/${id}/`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        return true;
    }
};

export default assignmentService;
