import axios from 'axios';
import { API_BASE_URL } from '@/config/env';
import * as SecureStore from 'expo-secure-store';

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: false,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('session');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

export default axiosInstance;
