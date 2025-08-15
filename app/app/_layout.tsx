import { Redirect, Slot } from 'expo-router';
import '../global.css';
import { ThemeProvider, useTheme } from '@/context/theme-context';
import { SessionProvider, useSession } from '@/context/auth-context';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';

Sentry.init({
    dsn: 'https://f36169899d815f57e1772719b0d269de@o4509849643909120.ingest.de.sentry.io/4509849645154384',

    environment: process.env.EXPO_PUBLIC_APP_ENV || 'production',

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

function Header() {
    const { currentTheme } = useTheme();
    const { session, isLoading } = useSession();

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
