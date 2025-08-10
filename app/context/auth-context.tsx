import { createContext, PropsWithChildren, useContext } from 'react';
import { useStorageState } from '@/hooks/use-storage-state';
import axiosInstance from '@/config/axios-config';
import { router } from 'expo-router';

interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at: string;
}

interface AuthContextType {
    signIn: (token: string, user: User) => void;
    signOut: () => void;
    session?: string | null;
    user?: User | null;
    isLoading: boolean;
    updateUser: (userData: unknown) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    user: null,
    isLoading: false,
    updateUser: async () => {},
});

export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be used within a <SessionProvider />');
        }
    }
    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');
    const [[, user], setUser] = useStorageState('user');

    const updateUser = async (userData: unknown) => {
        await setUser(userData);
    };

    const handleSignOut = async () => {
        try {
            if (session) {
                await axiosInstance.post('/logout', null, {
                    headers: {
                        Authorization: `Bearer ${session}`,
                    },
                });
            }

            setSession(null);
            setUser(null);
            router.replace('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const loadUserInfo = async (token: string) => {
        //
    };

    const parsedUser = user ? (() => {})() : null;

    const handleUpdateUser = async (userData: unknown) => {
        //
    };

    const handleSignIn = async (token: string, userData: User) => {
        //
    };

    return {
        //
    };
}
