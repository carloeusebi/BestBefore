import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert, Platform } from 'react-native';
import { router } from 'expo-router';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

const logoutUser = async () => {
    const user = () => {
        return Platform.OS === 'web' ? localStorage.getItem('user') : SecureStore.getItemAsync('user');
    };

    if (!user()) return;

    if (Platform.OS === 'web') {
        localStorage.removeItem('session');
        localStorage.removeItem('user');
    }
    await SecureStore.deleteItemAsync('session');
    await SecureStore.deleteItemAsync('user');

    Alert.alert('Sessione scaduta.', "Effettua di nuovo l'accesso per continuare.");

    router.replace('/sign-in');
};

const axiosInstance = axios.create({
    baseURL,
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

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error.response?.status === 401) {
            await logoutUser();
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
