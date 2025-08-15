import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { CalendarClock } from 'lucide-react-native';
import expirationsService from '@/services/expirations-service';
import { Expiration, LaravelPaginatedResponse } from '@/types';
import ExpirationCard from '@/components/expiration-card';
import { useIsFocused } from '@react-navigation/native';

export default function Index() {
    const [loading, setLoading] = useState(false);
    const [expirations, setExpirations] = useState<Expiration[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const isFocused = useIsFocused();

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
    }, [load, isFocused]);

    const renderItem = ({ item }: { item: Expiration }) => <ExpirationCard expiration={item} />;

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
