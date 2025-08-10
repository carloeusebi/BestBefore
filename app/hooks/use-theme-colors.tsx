import { useTheme } from '@/context/theme-context';
import { colors } from '@/constants/colors';

export const useThemeColors = () => {
    const { currentTheme } = useTheme();

    return colors[currentTheme as keyof typeof colors];
};
