import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useSession } from '@/context/auth-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { router } from 'expo-router';

export default function Profile() {
    const { user, signOut } = useSession();
    const colors = useThemeColors();

    const handleLogout = async () => {
        await signOut();
        router.replace('/sign-in');
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <View className="flex-1 items-center px-5 pt-10">
                <Image source={{ uri: user?.avatar }} className="h-32 w-32 rounded-full border-4" style={{ borderColor: colors.primary }} />
                <Text className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-100">{user?.name}</Text>
                <Text className="text-base text-gray-600 dark:text-gray-300">{user?.email}</Text>

                <TouchableOpacity
                    className="mt-10 h-[54px] w-full flex-row items-center justify-center rounded"
                    style={{ backgroundColor: colors.primary }}
                    onPress={handleLogout}
                >
                    <Text className="text-lg font-semibold text-white">Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
