import { useAuthStore } from '@/features/auth/authStore';
import axios from 'axios'

const api = axios.create({
    baseURL : import.meta.env.VITE_API_URL,
    withCredentials : true,
});

api.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

export default api;