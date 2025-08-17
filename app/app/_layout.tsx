import { Redirect, Slot } from 'expo-router';
import '../global.css';
import { ThemeProvider, useTheme } from '@/context/theme-context';
import { SessionProvider, useSession } from '@/context/auth-context';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';
import * as Notification from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import Constants from 'expo-constants';
import axiosInstance from '@/config/axios-config';

const environment = process.env.EXPO_PUBLIC_APP_ENV || 'production';

Sentry.init({
    dsn: 'https://f36169899d815f57e1772719b0d269de@o4509849643909120.ingest.de.sentry.io/4509849645154384',

    environment,

    enabled: !['local', 'development'].includes(environment),

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,

    // Configure Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
});

Notification.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

function Header() {
    const { currentTheme } = useTheme();
    const { session, isLoading, user } = useSession();

    const [expoPushToken, setExpoPushToken] = useState('');

    useEffect(() => {
        if (!user) return;
        const { id, email } = user;

        Sentry.setUser({ id, email });
    }, [user]);

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then((token) => setExpoPushToken(token ?? ''))
            .catch((error) => setExpoPushToken(`${error}`));
    }, []);

    useEffect(() => {
        if (expoPushToken.trim() && user) {
            void axiosInstance.post('api/expo-push-token', { expo_push_token: expoPushToken });
        }
    }, [expoPushToken, user]);

    if (session && !isLoading) {
        return (
            <>
                <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
                <Redirect href="/" />
            </>
        );
    }

    return <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />;
}

export default Sentry.wrap(function RootLayout() {
    return (
        <SessionProvider>
            <ThemeProvider>
                <Header />
                <Slot />
            </ThemeProvider>
        </SessionProvider>
    );
});

function handleRegistrationError(error: string) {
    Alert.alert('Errore', error);
    throw new Error(error);
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await Notification.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notification.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: colors.light.primary,
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notification.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notification.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            return (
                await Notification.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}
