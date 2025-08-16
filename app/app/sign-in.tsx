import { ActivityIndicator, Alert, Button, Image, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { useSession } from '@/context/auth-context';
import axiosInstance from '@/config/axios-config';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import { User } from '@/types';

type LoginResponse = {
    token: string;
    user: User;
};

const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
const webClientId = process.env.EXPO_PUBLIC_CLIENT_ID;

export default function WelcomeScreen() {
    const colors = useThemeColors();
    const { signIn } = useSession();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        GoogleSignin.configure({
            iosClientId,
            webClientId,
            profileImageSize: 150,
        });
    }, []);

    const retrieveUser = async (idToken: string) => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.post<LoginResponse>('/api/auth/login', { idToken });
            return data;
        } catch (error) {
            console.error('Error retrieving user data:', error);
            if (isAxiosError(error) && error.response?.data.error) {
                Alert.alert('Errore', error.response?.data.error);
            } else {
                Alert.alert('Errore', 'Si è verificato un errore inatteso.');
            }
        } finally {
            setLoading(false);
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
            console.error('Error signing in:', error);
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        Alert.alert("Accesso annullato dall'utente", error.message);
                        break;
                    case statusCodes.SIGN_IN_REQUIRED:
                        Alert.alert("È necessario effettuare l'accesso", error.message);
                        break;
                    case statusCodes.IN_PROGRESS:
                        Alert.alert('Operazione di accesso già in corso', error.message);
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        Alert.alert('Servizi Google Play non disponibili o non aggiornati', error.message);
                        break;
                    default:
                        Alert.alert('Si è verificato un errore imprevisto', error.message);
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
                        {loading ? (
                            <ActivityIndicator color={colors.primary} size="small" />
                        ) : (
                            <Image source={require('../assets/images/google-logo.png')} style={{ width: 25, height: 25 }} resizeMode="contain" />
                        )}
                        <Text className="text-lg font-semibold" style={{ color: colors.primary }}>
                            Accedi per iniziare
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
