import { categories } from '@/lib/categories';
import { Expiration } from '@/types';
import { router } from 'expo-router';
import { TouchableNativeFeedback, View, Text } from 'react-native';
import dates from '@/lib/dates';

type ExpirationCardProps = {
    expiration: Expiration;
};

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

export default function ExpirationCard({ expiration }: ExpirationCardProps) {
    const category = categories.getCategory(expiration.product?.category ?? null);
    const progress = getProgress(expiration.created_at, expiration.expires_at);
    const pct = Math.round(progress * 100);
    const progressColor = expiration.is_expired
        ? 'rgba(239,68,68,0.25)'
        : pct < 50
          ? 'rgba(34,197,94,0.25)'
          : pct < 80
            ? 'rgba(234,179,8,0.25)'
            : 'rgba(239,68,68,0.25)';

    const onPress = () => {
        const params = { expiration: JSON.stringify(expiration) };
        router.push({ pathname: '/expiration', params });
    };

    return (
        <TouchableNativeFeedback style={{ borderRadius: 12, overflow: 'hidden' }} onPress={onPress}>
            <View className={`relative ${expiration.is_expired && 'border-red-300 dark:border-red-700'} overflow-hidden bg-black/5 dark:bg-white/5`}>
                <View className="absolute left-0 top-0 h-full" style={{ width: `${pct}%`, backgroundColor: progressColor }} />
                <View className="flex-row items-center gap-3 p-3">
                    {category?.icon ? <category.icon size={30} color={expiration.is_expired ? '#ef4444' : '#111827'} /> : null}
                    <View className="flex-1">
                        <Text className="text-base font-medium text-black dark:text-white" numberOfLines={1}>
                            {expiration.product?.name ?? 'Prodotto'}
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300">{expiration.quantity}pz.</Text>
                        <View className="flex-row items-center gap-2">
                            {expiration.product?.brand ? (
                                <Text className="text-xs text-gray-700 dark:text-gray-300" numberOfLines={1}>
                                    {expiration.product.brand}
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
                        {expiration.expires_in ? (
                            <View className="rounded-full bg-black/10 px-2 py-1 dark:bg-white/10">
                                <Text className="text-xs text-black dark:text-white">{expiration.expires_in}</Text>
                            </View>
                        ) : null}
                    </View>
                    <View className="items-end">
                        <Text className="text-xs text-gray-600 dark:text-gray-300">Scadenza</Text>
                        <Text className={`text-sm font-semibold ${expiration.is_expired ? 'text-red-600' : 'text-black dark:text-white'}`}>
                            {expiration.is_expired ? 'Scaduto' : dates.format(expiration.expires_at)}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
}
