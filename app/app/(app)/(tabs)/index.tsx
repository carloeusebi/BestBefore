import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <Text className="text-gray-900 dark:text-gray-200">Home</Text>
        </SafeAreaView>
    );
}
