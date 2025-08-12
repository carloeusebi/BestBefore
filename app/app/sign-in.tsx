import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
// import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { CLIENT_ID, IOS_CLIENT_ID } from '@/config/env';
import { useSession } from '@/context/auth-context';
import axiosInstance from '@/config/axios-config';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import { User } from '@/types';

type LoginResponse = {
    token: string;
    user: User;
};

export default function WelcomeScreen() {
    const colors = useThemeColors();
    const { signIn } = useSession();

    // useEffect(() => {
    //     GoogleSignin.configure({
    //         iosClientId: IOS_CLIENT_ID,
    //         webClientId: CLIENT_ID,
    //         profileImageSize: 150,
    //     });
    // }, []);

    const retrieveUser = async (idToken: string) => {
        try {
            const { data } = await axiosInstance.post<{ data: LoginResponse }>('/api/auth/login', { idToken });
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
        const idToken =
            'eyJhbGciOiJSUzI1NiIsImtpZCI6ImJhNjNiNDM2ODM2YTkzOWI3OTViNDEyMmQzZjRkMGQyMjVkMWM3MDAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2NDg4MTk3MDc2OC1qNWo2OHQ1NWFtYWwzbjFlajk3cW12MnNndDR1M3ZnNi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjY0ODgxOTcwNzY4LTJjNHYzbW50MWxqaHI1b3JycXV2b2xoODg0cm9zMjNhLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAxNzgwMzE5OTI5NjI5MTczNjM0IiwiZW1haWwiOiJjYXJsb2V1c2ViaUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkNhcmxvIEV1c2ViaSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJTEx2Y2FfTFBJcHhyTzdBLTAzSVFMbkxsdzNnaHVIWGNJVU81UFp4MXQwYmZVVFBJUT1zOTYtYyIsImdpdmVuX25hbWUiOiJDYXJsbyIsImZhbWlseV9uYW1lIjoiRXVzZWJpIiwiaWF0IjoxNzU1MDEyMDkzLCJleHAiOjE3NTUwMTU2OTN9.Mewr1O25EdZQg1MeRkvqIEFl1O_lFIRbIr0gKJpwfPgGx43RYqlwEWrIsp_XsCJ-BRhnyprQPYJNaWD0vdLxrvNIxndgv_Kuu_CIXsrNfDm9u8z33cZL80IJsk4VkOfMKEQYhakIAi85zQoZlcaS1Va6RxIMNBmiuCwmO-aWTPurz6yx4CZC28yCZK5_zvg5HIRNZo4mZusPQyHCSVhW4Ma6AxAeZBSjnIW6GMhR0_Z3LR9mToXyhJqw2Dn4rwbYFi-XBHKchPGxFsAGwKddSHAgWsfjBIEly_kH-iaPNFoWQBHmKm-HBKRrmc-iEhCCqxWfdBI76UjDZN7_5R4Wyg';
        // try {
        //     await GoogleSignin.hasPlayServices();
        //     const response = await GoogleSignin.signIn();
        //     if (isSuccessResponse(response)) {
        //         const { idToken } = response.data;
        //         console.log('idToken:', idToken);
        //         if (!idToken) {
        //             console.error('No idToken');
        //             return;
        //         }

        const userData = await retrieveUser(idToken);

        if (!userData) {
            return;
        }

        signIn(userData.token, userData.user);
        router.replace('/');
        // }
        // } catch (error) {
        //     if (isErrorWithCode(error)) {
        //         switch (error.code) {
        //             case statusCodes.SIGN_IN_CANCELLED:
        //                 Alert.alert('User cancelled the login flow');
        //                 break;
        //             case statusCodes.SIGN_IN_REQUIRED:
        //                 Alert.alert('User must sign in');
        //                 break;
        //             case statusCodes.IN_PROGRESS:
        //                 Alert.alert('Operation (e.g. sign in) is in progress already');
        //                 break;
        //             case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        //                 Alert.alert('Play services not available or outdated. Maybe update.');
        //                 break;
        //             default:
        //                 Alert.alert('Some other error happened');
        //                 break;
        //         }
        //     } else {
        //         Alert.alert('Si è verificato un errore inatteso.');
        //     }
        // }
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
