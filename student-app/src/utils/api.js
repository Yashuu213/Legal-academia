import axios from 'axios';

const getBaseUrl = () => {
    // 1. Development Environment (Localhost)
    if (import.meta.env.DEV) {
        return 'http://localhost:5000/api';
    }

    // 2. Production Environment (Render)
    let url = import.meta.env.VITE_API_URL;
    console.log("VITE_API_URL:", url);

    // Hardcoded Fallback for Production
    if (!url) {
        return 'https://legal-academia-server.onrender.com/api';
    }

    // Robust Construction
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }

    if (!url.endsWith('/api')) {
        url = `${url}/api`;
    }

    return url;
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
