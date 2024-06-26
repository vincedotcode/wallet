// utils/api.ts
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: baseUrl,
});

// Add a request interceptor
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    const tenant = localStorage.getItem('userTenant');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (tenant) {
        config.headers['tenant'] = tenant;
    }
    config.headers['Content-Type'] = 'application/json';

    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
