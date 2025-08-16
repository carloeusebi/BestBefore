import { View, Text, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { useSession } from '@/context/auth-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import usersService from '@/services/users-service';

export default function Profile() {
    const { user, signOut } = useSession();
    const colors = useThemeColors();

    const [emailNotifications, setEmailNotifications] = useState<boolean>(user?.notifyByEmail ?? true);
    const [pushNotifications, setPushNotifications] = useState<boolean>(user?.notifyByPush ?? true);

    useEffect(() => {
        // Sincronizza con i cambiamenti dell'utente dal contesto (es. ricarica)
        setEmailNotifications(user?.notifyByEmail ?? true);
        setPushNotifications(user?.notifyByPush ?? true);
    }, [user?.notifyByEmail, user?.notifyByPush]);

    const handleLogout = async () => {
        await signOut();
        router.replace('/sign-in');
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            'Elimina account',
            'Questa azione è irreversibile. Verranno eliminati il tuo account e i dati associati idonei. Confermi di voler procedere?',
            [
                { text: 'Annulla', style: 'cancel' },
                {
                    text: 'Elimina account',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await usersService.deleteAccount();
                            Alert.alert('Account eliminato', 'Il tuo account è stato eliminato con successo.');
                            await signOut();
                            router.replace('/sign-in');
                        } catch (error) {
                            console.error('Errore eliminazione account', error);
                            Alert.alert('Errore', "Impossibile eliminare l'account in questo momento. Riprova più tardi.");
                        }
                    },
                },
            ],
        );
    };

    const persistSettings = async (next?: { email?: boolean; push?: boolean }) => {
        if (!user) return;
        try {
            await usersService.updateSettings({
                notify_by_email: next?.email ?? emailNotifications,
                notify_by_push: next?.push ?? pushNotifications,
            });
        } catch (error) {
            console.error('Failed to update settings', error);
            Alert.alert('Errore', 'Impossibile salvare le impostazioni. Riprova.');
        }
    };

    const onToggleEmail = (value: boolean) => {
        setEmailNotifications(value);
        void persistSettings({ email: value });
    };

    const onTogglePush = (value: boolean) => {
        setPushNotifications(value);
        void persistSettings({ push: value });
    };

    const bothDisabled = !emailNotifications && !pushNotifications;

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <View className="flex-1 px-5 pt-10">
                <View className="items-center">
                    <Image source={{ uri: user?.avatar }} className="h-32 w-32 rounded-full border-4" style={{ borderColor: colors.primary }} />
                    <Text className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-100">{user?.name}</Text>
                    <Text className="text-base text-gray-600 dark:text-gray-300">{user?.email}</Text>
                </View>

                <View className="mt-8 rounded-lg bg-black/5 p-4 dark:bg-white/5">
                    <Text className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">Notifiche</Text>

                    <View className="mb-4 flex-row items-center justify-between">
                        <View className="flex-1 pr-3">
                            <Text className="text-base font-medium text-gray-800 dark:text-gray-100">Email</Text>
                            <Text className="text-sm text-gray-600 dark:text-gray-300">Ricevi notifiche via email</Text>
                        </View>
                        <Switch value={emailNotifications} onValueChange={onToggleEmail} trackColor={{ true: colors.primary }} />
                    </View>

                    <View className="mb-2 flex-row items-center justify-between">
                        <View className="flex-1 pr-3">
                            <Text className="text-base font-medium text-gray-800 dark:text-gray-100">Push</Text>
                            <Text className="text-sm text-gray-600 dark:text-gray-300">Ricevi notifiche push</Text>
                        </View>
                        <Switch value={pushNotifications} onValueChange={onTogglePush} trackColor={{ true: colors.primary }} />
                    </View>

                    {bothDisabled && (
                        <View className="mt-4 rounded-md border border-amber-500 bg-amber-50 p-3 dark:border-amber-400 dark:bg-amber-900/20">
                            <Text className="text-sm text-amber-800 dark:text-amber-200">
                                Attenzione: con entrambe le notifiche disattivate non riceverai avvisi sulla scadenza dei prodotti.
                            </Text>
                        </View>
                    )}
                </View>

                <View className="flex-1">
                    <Text />
                </View>

                <TouchableOpacity
                    className="mt-4 h-[54px] w-full flex-row items-center justify-center rounded"
                    style={{ backgroundColor: colors.primary }}
                    onPress={handleLogout}
                >
                    <Text className="text-lg font-semibold text-white">Logout</Text>
                </TouchableOpacity>
                <View className="mt-3 justify-center">
                    <TouchableOpacity className="flex-row items-center justify-center" onPress={handleDeleteAccount}>
                        <Text className="text-base font-semibold text-red-500">Elimina account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
