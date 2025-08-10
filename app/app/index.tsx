import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/context/theme-context';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const WelcomeScreen = () => {
    const colors = useThemeColors();
    const { currentTheme } = useTheme();

    return (
        <SafeAreaView className={`flex-1 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <View className="flex-1 items-center px-5 pt-20">
                <View className="mb-5">
                    <Text className={`text-center text-3xl font-bold ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                        Benvenuto in Scadency
                    </Text>
                    <Text className={`text-center text-base font-semibold ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Tieni traccia delle scadenze dei prodotti e previeni gli sprechi
                    </Text>
                </View>

                <Image source={require('../assets/images/welcome.png')} className="mb-6 w-full flex-1 flex-grow" resizeMode="contain" />

                <Text className={`mb-5 text-center text-sm font-semibold ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Usa i filtri per categoria e attiva notifiche per scadenze vicine.
                </Text>

                <View className="w-full p-5">
                    <TouchableOpacity
                        className="h-[54px] flex-row items-center justify-center gap-3 rounded border"
                        style={{ borderColor: colors.primary }}
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
