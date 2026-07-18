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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken, user } = response.data.data;
                useAuthStore.getState().setAuth(user, accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch {
                useAuthStore.getState().logout();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
)
export default api;