import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '@/config/axios-config';

const WelcomeScreen = () => {
    const colors = useThemeColors();

    const handleLoginPress = () => {
        axiosInstance.get('api/auth/google/redirect').then((res) => {
            console.log(res);
        });
    };

    return (
        <SafeAreaView className=" bg-white dark:bg-gray-900 flex-1">
            <View className="flex-1 items-center px-5 pt-16">
                <View className="mb-5">
                    <Text className="text-gray-800 dark:text-gray-100 text-center text-3xl font-bold">Benvenuto in Scadency</Text>
                    <Text className="text-gray-600 dark:text-gray-300 text-center text-base font-semibold">
                        Tieni traccia delle scadenze dei prodotti e previeni gli sprechi
                    </Text>
                </View>

                <Image
                    source={require('../assets/images/welcome.png')}
                    className="mb-6 w-full max-w-[calc(100vw-70px)] flex-1 flex-grow"
                    resizeMode="contain"
                />

                <Text className="text-gray-600 dark:text-gray-300 mb-5 text-center text-sm font-semibold">
                    Usa i filtri per categoria e attiva notifiche per scadenze vicine.
                </Text>

                <View className="w-full p-5">
                    <TouchableOpacity
                        className="h-[54px] flex-row items-center justify-center gap-3 rounded border"
                        style={{ borderColor: colors.primary }}
                        onPress={handleLoginPress}
                    >
                        <Image source={require('../assets/images/google-logo.png')} style={{ width: 25, height: 25 }} resizeMode="contain" />
                        <Text className="text-lg font-semibold" style={{ color: colors.primary }}>
                            Accedi
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default WelcomeScreen;
