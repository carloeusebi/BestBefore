import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import type { Expiration, NotificationMethod } from '@/types';
import expirationsService from '@/services/expirations-service';
import ExpirationCard from '@/components/expiration-card';
import dates from '@/lib/dates';
import { PlusIcon } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function ExpirationDetail() {
    const { expiration: expirationString } = useLocalSearchParams<{ expiration?: string }>();

    const colors = useThemeColors();

    const [expiration, setExpiration] = useState<Expiration | null>(null);
    const [error, setError] = useState<string | null>(null);

    // local editable state
    const [quantity, setQuantity] = useState<number | null>(null);
    const [notificationMethod, setNotificationMethod] = useState<NotificationMethod>('both');

    // operations state
    const [savingQuantity, setSavingQuantity] = useState(false);
    const [savingNotification, setSavingNotification] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // other expirations state
    const [othersLoading, setOthersLoading] = useState(false);
    const [othersLoaded, setOthersLoaded] = useState(false);
    const [others, setOthers] = useState<Expiration[]>([]);

    useEffect(() => {
        try {
            if (!expirationString) throw new Error('Nessuna scadenza fornita');
            const parsed = JSON.parse(expirationString) as Expiration;
            setExpiration(parsed);
        } catch (e) {
            console.error(e);
            setError('Impossibile aprire il dettaglio della scadenza.');
        }
    }, [expirationString]);

    // sync local editable state when expiration loads/changes
    useEffect(() => {
        if (expiration) {
            setQuantity(expiration.quantity);
            setNotificationMethod((expiration.notification_method as NotificationMethod) || 'both');
            const productId = expiration.product_id ?? expiration.product?.id;
            if (productId) {
                if (othersLoaded) return;

                setOthersLoading(true);
                expirationsService
                    .getExpirations(1, { product: productId })
                    .then((res) => {
                        const list = res.data.filter((e) => e.id !== expiration.id);
                        setOthers(list);
                        setOthersLoaded(true);
                    })
                    .catch((e) => console.error(e))
                    .finally(() => setOthersLoading(false));
            } else {
                setOthers([]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expiration]);

    useEffect(() => {
        if (error) {
            Alert.alert('Errore', error, [{ text: 'OK', onPress: () => router.back() }]);
        }
    }, [error]);

    if (!expiration && !error) {
        return (
            <SafeAreaView edges={['top']} className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
                <ActivityIndicator />
            </SafeAreaView>
        );
    }

    if (!expiration) return null;

    const productId = expiration.product_id ?? expiration.product?.id;

    const doUpdate = async (payload: Partial<Expiration>) => {
        if (!expiration) return;
        try {
            const fullPayload = {
                product_id: productId,
                expires_at: expiration.expires_at,
                quantity: quantity ?? expiration.quantity,
                notes: expiration.notes,
                notification_days_before: expiration.notification_days_before,
                notification_method: notificationMethod,
                ...payload,
            };
            const updated = await expirationsService.updateExpiration(expiration.id, fullPayload);
            setExpiration(updated);
            return updated;
        } catch (e: any) {
            console.error(e);
            Alert.alert('Errore', 'Impossibile aggiornare la scadenza.');
        }
    };

    const onSaveQuantity = async () => {
        setSavingQuantity(true);
        try {
            await doUpdate({ quantity: quantity ?? 1 });
        } finally {
            setSavingQuantity(false);
        }
    };

    const onSaveNotification = async () => {
        setSavingNotification(true);
        try {
            await doUpdate({ notification_method: notificationMethod });
        } finally {
            setSavingNotification(false);
        }
    };

    const onDelete = async () => {
        if (!expiration) return;
        Alert.alert('Conferma eliminazione', 'Vuoi eliminare questa scadenza?', [
            { text: 'Annulla', style: 'cancel' },
            {
                text: 'Elimina',
                style: 'destructive',
                onPress: async () => {
                    try {
                        setDeleting(true);
                        await expirationsService.deleteExpiration(expiration.id);
                        Alert.alert('Eliminata', 'La scadenza è stata eliminata.', [
                            {
                                text: 'OK',
                                onPress: () => {
                                    router.replace('/(app)/(tabs)');
                                },
                            },
                        ]);
                    } catch (e) {
                        console.error(e);
                        Alert.alert('Errore', 'Impossibile eliminare la scadenza.');
                    } finally {
                        setDeleting(false);
                    }
                },
            },
        ]);
    };

    const MethodButton = ({ value, label }: { value: NotificationMethod; label: string }) => (
        <TouchableOpacity
            onPress={() => setNotificationMethod(value)}
            className={`flex-1 items-center justify-center rounded border px-3 py-2 ${
                notificationMethod === value ? 'border-emerald-700 bg-emerald-600' : 'border-gray-300 dark:border-gray-700'
            }`}
        >
            <Text className={`text-sm font-semibold ${notificationMethod === value ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-white dark:bg-gray-900">
            <ScrollView contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}>
                {/* Progress card */}
                <ExpirationCard expiration={expiration} />

                {/* Quantity editor */}
                <View className="mt-4 rounded-lg border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/10">
                    <View className="mb-3 flex-row items-center justify-between">
                        <Text className="text-gray-700 dark:text-gray-300">Quantità</Text>
                        <Text className="font-semibold text-black dark:text-white">{quantity}</Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity
                            onPress={() => setQuantity((q) => Math.max(0, (q ?? 1) - 1))}
                            className="flex-1 items-center justify-center rounded border border-gray-300 py-1  dark:border-gray-700"
                        >
                            <Text className=" text-lg font-semibold  text-gray-800 dark:text-gray-200">−</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setQuantity((q) => (q ?? 0) + 1)}
                            className="flex-1 items-center justify-center rounded border border-gray-300 py-1 dark:border-gray-700"
                        >
                            <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200">＋</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onSaveQuantity}
                            disabled={savingQuantity}
                            className="flex-1 items-center justify-center rounded bg-emerald-600 py-2 disabled:opacity-60"
                        >
                            {savingQuantity ? <ActivityIndicator color="#fff" /> : <Text className="font-semibold text-white">Salva</Text>}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Notification method */}
                <View className="mt-4 rounded-lg border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/10">
                    <Text className="mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">Metodo di notifica</Text>
                    <View className="flex-row gap-2">
                        <MethodButton value="none" label="Nessuna" />
                        <MethodButton value="push" label="Push" />
                    </View>
                    <View className="mt-2 flex-row gap-2">
                        <MethodButton value="email" label="Email" />
                        <MethodButton value="both" label="Entrambi" />
                    </View>
                    <View className="mt-3">
                        <TouchableOpacity
                            onPress={onSaveNotification}
                            disabled={savingNotification}
                            className="items-center justify-center rounded bg-emerald-600 py-2 disabled:opacity-60"
                        >
                            {savingNotification ? <ActivityIndicator color="#fff" /> : <Text className="font-semibold text-white">Salva metodo</Text>}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Notes */}
                {expiration.notes ? (
                    <View className="mt-4 rounded-lg border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/10">
                        <Text className="mb-1 text-gray-700 dark:text-gray-300">Note</Text>
                        <Text className="text-black dark:text-white">{expiration.notes}</Text>
                    </View>
                ) : null}

                <View className="mt-6 flex-row gap-3">
                    <TouchableOpacity
                        onPress={onDelete}
                        disabled={deleting}
                        className="flex-1 items-center justify-center rounded border border-red-600 py-3 disabled:opacity-60"
                    >
                        <Text className="font-semibold text-red-700 dark:text-red-400">{deleting ? 'Eliminazione…' : 'Elimina'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Other expirations same product */}
                {productId ? (
                    <View className="mt-6">
                        <Text className="mb-2 text-base font-semibold text-black dark:text-white">Altre scadenze di questo prodotto</Text>
                        {othersLoading ? (
                            <ActivityIndicator />
                        ) : others.length === 0 ? (
                            <Text className="text-sm text-gray-600 dark:text-gray-300">Nessun altra scadenza trovata.</Text>
                        ) : (
                            <View className="gap-2">
                                {others.map((e) => (
                                    <TouchableOpacity
                                        key={e.id}
                                        className="rounded-lg border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/10"
                                        onPress={() =>
                                            router.push({
                                                pathname: '/(app)/expiration',
                                                params: { expiration: JSON.stringify(e) },
                                            })
                                        }
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-sm text-black dark:text-white">{dates.format(e.expires_at)}</Text>
                                            <Text className="text-xs text-gray-600 dark:text-gray-300">{e.quantity}pz</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {expiration.product && (
                            <TouchableOpacity
                                className="mt-2 rounded-lg border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/10"
                                onPress={() => {
                                    router.push({
                                        pathname: '/(app)/create-expiration',
                                        params: { product: JSON.stringify(expiration.product) },
                                    });
                                }}
                            >
                                <View className="flex-row items-center justify-center">
                                    <PlusIcon color={colors.text} />
                                    <Text>Aggiungi un&#39;altra scadenza.</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}
