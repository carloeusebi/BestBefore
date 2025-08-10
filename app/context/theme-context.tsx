import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { useStorageState } from '@/hooks/use-storage-state';

type ThemeType = 'light' | 'dark' | 'system';
type CurrentTheme = Omit<ThemeType, 'system'>;

interface ThemeContextType {
    theme: ThemeType;
    currentTheme: CurrentTheme;
    setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'system',
    currentTheme: 'system',
    setTheme: () => null,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme() as CurrentTheme;
    const [[, storedTheme], setStoredTheme] = useStorageState('theme');
    const [theme, setThemeState] = useState<ThemeType>('system');
    const [currentTheme, setCurrentTheme] = useState<CurrentTheme>('dark');

    useEffect(() => {
        if (storedTheme) {
            setThemeState(storedTheme as ThemeType);
        }
    }, [storedTheme]);

    useEffect(() => {
        if (theme === 'system') {
            setCurrentTheme(systemColorScheme || 'dark');
        } else {
            setCurrentTheme(theme as CurrentTheme);
        }
    }, [theme, systemColorScheme]);

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            if (theme === 'system') {
                setCurrentTheme((colorScheme as CurrentTheme) || 'dark');
            } else {
                setCurrentTheme(colorScheme as CurrentTheme);
            }
        });

        return () => subscription.remove();
    }, [theme]);

    const setTheme = (newTheme: ThemeType) => {
        setTheme(newTheme);
        setStoredTheme(newTheme);
    };

    return <ThemeContext.Provider value={{ theme, currentTheme, setTheme }}>{children}</ThemeContext.Provider>;
};
