import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (import.meta.env.PROD && !configuredApiUrl) {
    throw new Error('VITE_API_URL precisa estar configurada em produção.');
}

const api = axios.create({
    baseURL: (configuredApiUrl || 'http://localhost:3001').replace(/\/$/, ''),
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;