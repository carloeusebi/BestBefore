import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { CLIENT_ID, IOS_CLIENT_ID } from '@/config/env';
import { User, useSession } from '@/context/auth-context';
import axiosInstance, { ApiResponse } from '@/config/axios-config';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';

type LoginResponse = {
    token: string;
    user: User;
};

export default function WelcomeScreen() {
    const colors = useThemeColors();
    const { signIn } = useSession();

    useEffect(() => {
        GoogleSignin.configure({
            iosClientId: IOS_CLIENT_ID,
            webClientId: CLIENT_ID,
            profileImageSize: 150,
        });
    }, []);

    const retrieveUser = async (idToken: string) => {
        try {
            const { data } = await axiosInstance.post<ApiResponse<LoginResponse>>('/api/auth/login', { idToken });
            return data.data;
        } catch (error) {
            console.error('Error retrieving user data:', error);
            if (isAxiosError(error) && error.response?.data.message) {
                Alert.alert('Errore', error.response?.data.message);
            } else {
                Alert.alert('Errore', 'Si è verificato un errore inatteso.');
            }
        }
    };

    const signInGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {
                const { idToken } = response.data;
                if (!idToken) {
                    console.error('No idToken');
                    return;
                }

                const userData = await retrieveUser(idToken);

                if (!userData) {
                    return;
                }

                signIn(userData.token, userData.user);
                router.replace('/');
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        Alert.alert('User cancelled the login flow');
                        break;
                    case statusCodes.SIGN_IN_REQUIRED:
                        Alert.alert('User must sign in');
                        break;
                    case statusCodes.IN_PROGRESS:
                        Alert.alert('Operation (e.g. sign in) is in progress already');
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        Alert.alert('Play services not available or outdated. Maybe update.');
                        break;
                    default:
                        Alert.alert('Some other error happened');
                        break;
                }
            } else {
                Alert.alert('Si è verificato un errore inatteso.');
            }
        }
    };

    return (
        <SafeAreaView className=" flex-1 bg-white dark:bg-gray-900">
            <View className="flex-1 items-center px-5 pt-16">
                <View className="mb-5">
                    <Text className="text-center text-3xl font-bold text-gray-800 dark:text-gray-100">Benvenuto in BestBefore</Text>
                    <Text className="text-center text-base font-semibold text-gray-600 dark:text-gray-300">
                        Tieni traccia delle scadenze dei prodotti e previeni gli sprechi
                    </Text>
                </View>

                <Image
                    source={require('../assets/images/welcome.png')}
                    className="mb-6 w-full max-w-[calc(100vw-70px)] flex-1 flex-grow"
                    resizeMode="contain"
                />

                <Text className="mb-5 text-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Usa i filtri per categoria e attiva notifiche per scadenze vicine.
                </Text>

                <View className="w-full p-5">
                    <TouchableOpacity
                        className="h-[54px] flex-row items-center justify-center gap-3 rounded border"
                        style={{ borderColor: colors.primary }}
                        onPress={signInGoogle}
                    >
                        <Image source={require('../assets/images/google-logo.png')} style={{ width: 25, height: 25 }} resizeMode="contain" />
                        <Text className="text-lg font-semibold" style={{ color: colors.primary }}>
                            Accedi per iniziare
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
