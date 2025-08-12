import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { useStorageState } from '@/hooks/use-storage-state';
import axiosInstance, { ApiResponse } from '@/config/axios-config';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

interface AuthContextType {
    signIn: (token: string, user: User) => void;
    signOut: (() => Promise<void>) | (() => void);
    session?: string | null;
    user?: User | null;
    isLoading: boolean;
    updateUser: (userData: User) => void;
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

    const logoutUser = () => {
        setSession(null);
        setUser(null);
        router.replace('/sign-in');
    };

    const handleSignOut = async () => {
        try {
            if (session) {
                await axiosInstance.post('/api/auth/logout', null, {
                    headers: {
                        Authorization: `Bearer ${session}`,
                    },
                });
            }

            logoutUser();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const loadUserInfo = async (token: string) => {
        try {
            const response = await axiosInstance.get<ApiResponse<User>>('/api/auth/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(JSON.stringify(response.data.data));
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 401) {
                logoutUser();
            } else {
                console.error('Error loading user info:', error);
            }
        }
    };

    useEffect(() => {
        if (session) {
            void loadUserInfo(session);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    const parsedUser = user
        ? (() => {
              try {
                  return JSON.parse(user);
              } catch (error) {
                  console.error('Error parsing user data:', error);
                  return null;
              }
          })()
        : null;

    const handleUpdateUser = (userData: User) => {
        try {
            const userString = JSON.stringify(userData);
            setUser(userString);
        } catch (e) {
            console.error('Error updating user data:', e);
            throw e;
        }
    };

    const handleSignIn = (token: string, userData: User) => {
        try {
            setSession(token);
            setUser(JSON.stringify(userData));
            router.replace('/');
        } catch (e) {
            console.error('Error signing in:', e);
            throw e;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                signIn: handleSignIn,
                signOut: handleSignOut,
                session,
                user: parsedUser,
                isLoading,
                updateUser: handleUpdateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
