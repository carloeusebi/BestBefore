import { Animated } from 'react-native';
import { LoaderCircle } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';

export function Loader() {
    const spinValue = new Animated.Value(0);
    const colors = useThemeColors();

    Animated.loop(
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }),
    ).start();

    return (
        <Animated.View
            style={{
                transform: [
                    {
                        rotate: spinValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg'],
                        }),
                    },
                ],
            }}
        >
            <LoaderCircle size={25} color={colors.primary} />
        </Animated.View>
    );
}
