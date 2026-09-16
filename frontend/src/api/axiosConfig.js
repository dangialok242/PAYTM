import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Aapka backend URL
});

// Interceptor jo automatically localStorage se token utha kar bhej dega
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;