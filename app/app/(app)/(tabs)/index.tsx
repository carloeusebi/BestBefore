import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import expirationsService from '@/services/expirations-service';
import { Expiration } from '@/types';
import { categories } from '@/lib/categories';

function formatDate(dateStr?: string | null) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return String(dateStr);
    return date.toLocaleDateString();
}

function getProgress(start?: string, end?: string): number {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const now = new Date();
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
    const total = endDate.getTime() - startDate.getTime();
    if (total <= 0) return now.getTime() >= endDate.getTime() ? 1 : 0; // if invalid or same day, show either 0 or 100%
    const elapsed = now.getTime() - startDate.getTime();
    const ratio = elapsed / total;

    return Math.max(0, Math.min(1, ratio));
}

export default function Index() {
    const [loading, setLoading] = useState(false);
    const [expirations, setExpirations] = useState<Expiration[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await expirationsService.getExpirations();
            setExpirations(res.data);
        } catch (err: any) {
            setError(err?.message ?? 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const res = await expirationsService.getExpirations();
            setExpirations(res.data);
        } catch (err) {
            // keep previous error handling minimal for pull-to-refresh
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const renderItem = ({ item }: { item: Expiration }) => {
        const category = categories.getCategory(item.product?.category ?? null);
        const progress = getProgress(item.created_at, item.expires_at);
        const pct = Math.round(progress * 100);

        return (
            <TouchableNativeFeedback className="divide-y overflow-hidden" onPress={() => console.log('Pressed', item)}>
                <View className={`relative rounded ${item.is_expired && 'bg-red-100 dark:bg-red-800'}`}>
                    <View
                        className={`absolute left-0 top-0 h-full ${!item.is_expired && 'bg-gray-100 dark:bg-gray-800'}`}
                        style={{ width: `${pct}%` }}
                    />
                    <View className="flex-row items-center gap-3 px-3 py-5">
                        {category?.icon ? <category.icon size={30} color={item.is_expired ? '#ef4444' : '#111827'} /> : null}
                        <View className="flex-1">
                            <Text className="text-xl font-medium text-black dark:text-white" numberOfLines={1}>
                                {item.product?.name ?? 'Prodotto'}
                            </Text>
                            <View className="flex-row items-center gap-2">
                                {item.product?.brand ? (
                                    <Text className="text-xs text-gray-700 dark:text-gray-300" numberOfLines={1}>
                                        {item.product.brand}
                                    </Text>
                                ) : null}
                                {category?.label ? (
                                    <Text className="text-xs text-gray-600 dark:text-gray-400" numberOfLines={1}>
                                        • {category.label}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                        <View className="flex-shrink-0">
                            <Text className="text-xs text-gray-500">{item.expires_in}</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-xs text-gray-600 dark:text-gray-300">Scadenza</Text>
                            <Text className={`text-sm font-semibold ${item.is_expired ? 'text-red-600' : 'text-black dark:text-white'}`}>
                                {item.is_expired ? 'Scaduto' : formatDate(item.expires_at)}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            {loading && expirations.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" />
                    <Text className="mt-2 text-gray-700 dark:text-gray-300">Caricamento…</Text>
                </View>
            ) : error ? (
                <View className="flex-1 items-center justify-center px-6">
                    <Text className="mb-3 text-center text-red-600">{error}</Text>
                    <TouchableOpacity onPress={load} className="rounded-lg bg-black px-4 py-2 dark:bg-white">
                        <Text className="text-white dark:text-black">Riprova</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
                    data={expirations}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ListEmptyComponent={
                        !loading ? (
                            <View className="mt-20 items-center">
                                <Text className="text-gray-600 dark:text-gray-300">Nessuna scadenza trovata</Text>
                            </View>
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
}
