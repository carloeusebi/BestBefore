import { useEffect, useMemo, useState } from 'react';
import { SectionList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import productsService from '@/services/products-service';
import { Product } from '@/types';
import { Button } from '@/components/button';
import { router } from 'expo-router';
import { PlusIcon } from 'lucide-react-native';
import { useStorageState } from '@/hooks/use-storage-state';

export default function SelectProduct() {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<Product[]>([]);

    // Recent selections persistence
    const RECENTS_KEY = 'recent_products';
    const [[recLoading, recentsRaw], setRecentsRaw] = useStorageState(RECENTS_KEY);
    const [recents, setRecents] = useState<Product[]>([]);

    useEffect(() => {
        if (!recLoading) {
            if (recentsRaw) {
                try {
                    const parsed = JSON.parse(recentsRaw) as Product[];
                    if (Array.isArray(parsed)) setRecents(parsed);
                } catch (e) {
                    console.error('Error parsing recents', e);
                    setRecents([]);
                }
            } else {
                setRecents([]);
            }
        }
    }, [recLoading, recentsRaw]);

    const saveRecents = (items: Product[]) => {
        try {
            setRecents(items);
            setRecentsRaw(JSON.stringify(items));
        } catch (e) {
            console.error('Error saving recents', e);
        }
    };

    // Debounce query input
    useEffect(() => {
        const handle = setTimeout(() => setDebouncedQuery(query.trim()), 400);
        return () => clearTimeout(handle);
    }, [query]);

    useEffect(() => {
        const search = async () => {
            if (!debouncedQuery) {
                setResults([]);
                setError(null);
                return;
            }

            if (debouncedQuery.length < 3) return;

            setError(null);
            try {
                const data = await productsService.searchProducts(debouncedQuery);
                setResults(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
                setError('Errore durante la ricerca');
            }
        };

        void search();
    }, [debouncedQuery]);

    const onSelectProduct = (product: Product) => {
        // Update recents: move to front, dedupe by id, cap 10
        const existingIdx = recents.findIndex((p) => p.id === product.id);
        const updated = [product, ...recents.filter((p, idx) => idx !== existingIdx && p.id !== product.id)].slice(0, 10);
        saveRecents(updated);

        const params = { product: JSON.stringify(product) };
        router.push({ pathname: '/(app)/create-expiration', params });
    };

    const renderItem = ({ item }: { item: Product }) => (
        <TouchableOpacity onPress={() => onSelectProduct(item)}>
            <View className="mb-2 rounded-lg bg-black/5 p-3 dark:bg-white/10">
                <Text className="mb-1 text-base font-medium text-black dark:text-white">{item.name}</Text>
                {item.brand ? <Text className="text-xs text-gray-700 dark:text-gray-300">{item.brand}</Text> : null}
            </View>
        </TouchableOpacity>
    );

    const keyExtractor = useMemo(() => (item: Product) => item.id, []);

        // Dedupe: avoid showing items in recents that are already in results
        const recentsFiltered = useMemo(() => {
            if (!recents || recents.length === 0) return [] as Product[];
            if (!results || results.length === 0) return recents;
            const resultIds = new Set(results.map((r) => r.id));
            return recents.filter((p) => !resultIds.has(p.id));
        }, [recents, results]);

        // Build sections: Results (if any) on top, then Recenti (always if any)
        const sections = useMemo(() => {
            const s: { title: string; data: Product[] }[] = [];
            if (results.length > 0) s.push({ title: 'Risultati', data: results });
            if (recentsFiltered.length > 0) s.push({ title: 'Recenti', data: recentsFiltered });
            return s;
        }, [results, recentsFiltered]);

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-white p-4 dark:bg-gray-900">
            <View className="mb-3">
                <Text className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">Cerca prodotto</Text>
                <View className="flex-row gap-2">
                    <TextInput
                        placeholder="Inserisci il nome del prodotto..."
                        value={query}
                        onChangeText={setQuery}
                        className="h-12 flex-1 rounded border border-gray-300 bg-white px-3 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                    />
                    <Button className="h-12" onPress={() => router.push('/(app)/create-product')}>
                        <PlusIcon color="white" />
                    </Button>
                </View>
            </View>

            {!!error && <Text className="my-2 text-sm text-red-600">{error}</Text>}

            {debouncedQuery.length > 0 && results.length === 0 && !error && (
                <Text className="my-2 text-sm text-gray-600 dark:text-gray-300">Nessun prodotto trovato</Text>
            )}

            <SectionList
                sections={sections}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                renderSectionHeader={({ section }) => (
                    <View className="mb-2 mt-2">
                        <Text className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">{section.title}</Text>
                    </View>
                )}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
}
