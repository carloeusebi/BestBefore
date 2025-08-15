import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { CalendarClock } from 'lucide-react-native';
import expirationsService from '@/services/expirations-service';
import { Expiration, LaravelPaginatedResponse } from '@/types';
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

    // pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadPage = useCallback(async (page = 1) => {
        return await expirationsService.getExpirations(page);
    }, []);

    const load = useCallback(async () => {
        setError(null);
        setLoading(true);
        try {
            const res = (await loadPage(1)) as LaravelPaginatedResponse<Expiration>;
            setExpirations(res.data);
            setCurrentPage(res.meta.current_page);
            setLastPage(res.meta.last_page);
        } catch (err: any) {
            setError(err?.message ?? 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }, [loadPage]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const res = (await loadPage(1)) as LaravelPaginatedResponse<Expiration>;
            setExpirations(res.data);
            setCurrentPage(res.meta.current_page);
            setLastPage(res.meta.last_page);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            // keep previous error handling minimal for pull-to-refresh
        } finally {
            setRefreshing(false);
        }
    }, [loadPage]);

    const loadMore = useCallback(async () => {
        if (loading || refreshing || loadingMore) return;
        if (currentPage >= lastPage) return;
        setLoadingMore(true);
        try {
            const nextPage = currentPage + 1;
            const res = (await loadPage(nextPage)) as LaravelPaginatedResponse<Expiration>;
            setExpirations((prev) => [...prev, ...res.data]);
            setCurrentPage(res.meta.current_page);
            setLastPage(res.meta.last_page);
        } catch (err: any) {
            setError(err?.message ?? 'Something went wrong');
        } finally {
            setLoadingMore(false);
        }
    }, [currentPage, lastPage, loadPage, loading, refreshing, loadingMore]);

    useEffect(() => {
        void load();
    }, [load]);

    const renderItem = ({ item }: { item: Expiration }) => {
        const category = categories.getCategory(item.product?.category ?? null);
        const progress = getProgress(item.created_at, item.expires_at);
        const pct = Math.round(progress * 100);
        const progressColor = item.is_expired
            ? 'rgba(239,68,68,0.25)'
            : pct < 50
              ? 'rgba(34,197,94,0.25)'
              : pct < 80
                ? 'rgba(234,179,8,0.25)'
                : 'rgba(239,68,68,0.25)';

        return (
            <TouchableNativeFeedback className="overflow-hidden" onPress={() => console.log('Pressed', item)}>
                <View
                    className={`relative rounded-xl ${item.is_expired && 'border-red-300 dark:border-red-700'} overflow-hidden bg-black/5 dark:bg-white/5`}
                >
                    <View className="absolute left-0 top-0 h-full" style={{ width: `${pct}%`, backgroundColor: progressColor }} />
                    <View className="flex-row items-center gap-3 p-3">
                        {category?.icon ? <category.icon size={30} color={item.is_expired ? '#ef4444' : '#111827'} /> : null}
                        <View className="flex-1">
                            <Text className="text-base font-medium text-black dark:text-white" numberOfLines={1}>
                                {item.product?.name ?? 'Prodotto'}
                            </Text>
                            <Text className="text-gray-700 dark:text-gray-300">{item.quantity}pz.</Text>
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
                            {item.expires_in ? (
                                <View className="rounded-full bg-black/10 px-2 py-1 dark:bg-white/10">
                                    <Text className="text-xs text-black dark:text-white">{item.expires_in}</Text>
                                </View>
                            ) : null}
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
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
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
                    ItemSeparatorComponent={() => <View className="h-0.5" />}
                    ListHeaderComponent={
                        <View className="mb-3 px-1">
                            <View className="mb-2 flex-row items-center gap-2">
                                <CalendarClock size={20} color="#6b7280" />
                                <Text className="text-lg font-semibold text-black dark:text-white">Le tue scadenze</Text>
                            </View>
                            <Text className="text-sm text-gray-600 dark:text-gray-300">
                                Tieni traccia dei prodotti e delle loro date di scadenza. La barra colorata sullo sfondo indica quanto sei vicino alla
                                scadenza.
                            </Text>
                        </View>
                    }
                    ListEmptyComponent={
                        !loading ? (
                            <View className="mt-20 items-center gap-3">
                                <CalendarClock size={36} color="#9ca3af" />
                                <Text className="text-gray-600 dark:text-gray-300">Nessuna scadenza trovata</Text>
                            </View>
                        ) : null
                    }
                    onEndReachedThreshold={0.4}
                    onEndReached={loadMore}
                    ListFooterComponent={
                        loadingMore ? (
                            <View className="items-center py-4">
                                <ActivityIndicator />
                            </View>
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
}
