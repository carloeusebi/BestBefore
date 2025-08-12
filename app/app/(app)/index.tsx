import { Alert, Platform, Text, View } from 'react-native';
import { useSession } from '@/context/auth-context';
import { Button } from '@/components/button';

export default function Main() {
    const { user, signOut } = useSession();

    const handleLogout = () => {
        if (Platform.OS === 'web') {
            if (window.confirm('Sei sicuro di voler uscire?')) {
                signOut();
            }
        } else {
            Alert.alert(
                'Logout',
                'Sei sicuro di voler uscire?',
                [
                    {
                        text: 'Annulla',
                        style: 'cancel',
                    },
                    {
                        text: 'Esci',
                        style: 'destructive',
                        onPress: () => signOut(),
                    },
                ],
                { cancelable: true },
            );
        }
    };

    return (
        <View>
            <Text>Benvenuto, {user?.name}</Text>

            <Button variant="destructive" onPress={handleLogout}>
                <Text className="text-center font-semibold text-white">Esci</Text>
            </Button>
        </View>
    );
}
