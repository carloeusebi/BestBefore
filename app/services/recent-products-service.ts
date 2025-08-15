import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Product } from '@/types';

const RECENTS_KEY = 'recent_products';
const MAX_RECENTS = 10;

async function storageGet(key: string): Promise<string | null> {
    try {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        }
        return await SecureStore.getItemAsync(key);
    } catch (e) {
        console.error(`[recent-products-service] Error getting key ${key} from storage`, e);
        return null;
    }
}

async function storageSet(key: string, value: string | null): Promise<void> {
    try {
        if (Platform.OS === 'web') {
            if (value === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value);
            }
        } else {
            if (value === null) {
                await SecureStore.deleteItemAsync(key);
            } else {
                await SecureStore.setItemAsync(key, value);
            }
        }
    } catch (e) {
        console.error(`[recent-products-service] Error setting key ${key} in storage`, e);
    }
}

function normalizeList(items: Product[]): Product[] {
    // Dedupe by id while preserving order, cap length
    const seen = new Set<string>();
    const result: Product[] = [];
    for (const p of items) {
        if (!p || !p.id) continue;
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        result.push(p);
        if (result.length >= MAX_RECENTS) break;
    }
    return result;
}

export default {
    async getRecents(): Promise<Product[]> {
        const raw = await storageGet(RECENTS_KEY);
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw) as unknown;
            if (Array.isArray(parsed)) {
                // Best-effort validate shape
                return normalizeList(parsed as Product[]);
            }
            return [];
        } catch (e) {
            console.error('[recent-products-service] Error parsing recents', e);
            return [];
        }
    },

    async setRecents(list: Product[]): Promise<Product[]> {
        const normalized = normalizeList(list ?? []);
        await storageSet(RECENTS_KEY, JSON.stringify(normalized));
        return normalized;
    },

    async addRecent(product: Product): Promise<Product[]> {
        if (!product || !product.id) return this.getRecents();
        const current = await this.getRecents();
        const filtered = current.filter((p) => p.id !== product.id);
        const updated = normalizeList([product, ...filtered]);
        await storageSet(RECENTS_KEY, JSON.stringify(updated));
        return updated;
    },

    async removeRecent(productId: Product['id']): Promise<Product[]> {
        const current = await this.getRecents();
        const updated = current.filter((p) => p.id !== productId);
        await storageSet(RECENTS_KEY, JSON.stringify(updated));
        return updated;
    },

    async clearRecents(): Promise<void> {
        await storageSet(RECENTS_KEY, null);
    },
};
