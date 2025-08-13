import { useThemeColors } from '@/hooks/use-theme-colors';
import { Tabs } from 'expo-router';
import { BarcodeIcon, HomeIcon, PlusIcon } from 'lucide-react-native';
import { Image } from 'react-native';
import { useSession } from '@/context/auth-context';

export default function TabsLayout() {
    const colors = useThemeColors();
    const { user } = useSession();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondaryText,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="scan"
                options={{
                    title: 'Scansiona',
                    tabBarIcon: ({ color, size }) => <BarcodeIcon size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="select-product"
                options={{
                    title: 'Aggiungi',
                    tabBarIcon: ({ color, size }) => <PlusIcon size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profilo',
                    tabBarIcon: ({ size, color }) => (
                        <Image
                            source={{ uri: user?.avatar }}
                            style={{
                                width: size,
                                height: size,
                                borderRadius: size / 2,
                                borderWidth: 2,
                                borderColor: color,
                            }}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
