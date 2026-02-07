import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL;
    console.log("VITE_API_URL:", url); // Debugging

    if (!url) return 'http://127.0.0.1:5000/api';

    // If it's just a hostname (Render injects this via property: host)
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }

    // Ensure it ends with /api
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
