import Axios, { InternalAxiosRequestConfig } from 'axios';
import { storage } from './storage';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
    const token = storage.get('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}

export const api = Axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message;
        return Promise.reject(message);
    },
);
