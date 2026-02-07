import axios from 'axios';

const getBaseUrl = () => {
    const url = import.meta.env.VITE_API_URL;
    if (!url) return 'http://127.0.0.1:5000/api';
    if (url.startsWith('http')) return url;
    return `https://${url}/api`;
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
