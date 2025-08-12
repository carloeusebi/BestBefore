import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/context/auth-context';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { ActivityIndicator, View } from 'react-native';

export default function AppLayout() {
    const { session, isLoading } = useSession();
    const colors = useThemeColors();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!session) {
        return <Redirect href="/sign-in" />;
    }

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTintColor: colors.primary,
                headerTitleStyle: {
                    color: colors.text,
                },
                contentStyle: {
                    backgroundColor: colors.background,
                },
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}
