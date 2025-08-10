import * as SecureStore from 'expo-secure-store';
import {Platform} from 'react-native';
import {useCallback, useEffect, useState} from "react";

const storage = {
  get: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.error(`Error getting value from storage: key ${key}`, e);
      return null;
    }
  },
  set: async (key: string, value: string | null): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (value === null) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, value);
        }
      } else {
        if (value === null) {
          await SecureStore.deleteItemAsync(key)
        } else {
          await SecureStore.setItemAsync(key, value);
        }
      }

    } catch (e) {
      console.error(`Error setting value in storage: key ${key}`, e);
      return;
    }
  }
}

type StorageState = [[boolean, string | null], (value: string | null) => void];

export function useStorageState(key: string): StorageState {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    storage.get(key).then(value => {
      setValue(value);
      setIsLoading(false);
    })
  }, [key]);

  const updateValue = useCallback((value: string | null) => {
    setValue(value);
    void storage.set(key, value);
  }, [key]);

  return [
    [isLoading, value],
    updateValue
  ];
}
