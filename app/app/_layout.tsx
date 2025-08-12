import { Redirect, Slot } from 'expo-router';
import '../global.css';
import { ThemeProvider, useTheme } from '@/context/theme-context';
import { SessionProvider, useSession } from '@/context/auth-context';
import { StatusBar } from 'expo-status-bar';

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

export default function RootLayout() {
    return (
        <SessionProvider>
            <ThemeProvider>
                <Header />
                <Slot />
            </ThemeProvider>
        </SessionProvider>
    );
}
