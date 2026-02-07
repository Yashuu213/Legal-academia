import axios from 'axios';

const getBaseUrl = () => {
    // 1. Check for VITE_API_URL from environment (Render injection)
    let url = import.meta.env.VITE_API_URL;
    console.log("VITE_API_URL:", url);

    // 2. HARDCODED FALLBACK: If env is missing or localhost (development fallback failure)
    // This ensures production always hits the right backend.
    if (!url || url.includes('localhost') || url.includes('127.0.0.1')) {
        return 'https://legal-academia-server.onrender.com/api';
    }

    // 3. Robust Construction (for Render's property: host)
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }

    if (!url.endsWith('/api')) {
        url = `${url}/api`;
    }

    console.log("Final Base URL:", url);
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
