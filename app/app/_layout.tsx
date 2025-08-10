import { Stack } from 'expo-router';
import '../global.css';
import { ThemeProvider } from '@/context/theme-context';

export default function RootLayout() {
    return (
        <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
    );
}
