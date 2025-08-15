import { router, useLocalSearchParams } from 'expo-router';
import { Alert, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Expiration, Product, ValidationErrors } from '@/types';
import expirationsService from '@/services/expirations-service';
import productsService from '@/services/products-service';
import { Datepicker } from '@/components/datepicker';
import { isAxiosError } from 'axios';
import Spacer from '@/components/spacer';
import Input from '@/components/input';
import ProductCard from '@/components/product-card';
import { FormField } from '@/components/form-field';
import recentProductsService from '@/services/recent-products-service';

type ExpirationForm = Partial<{
    product_id: Expiration['product_id'];
    expires_at: Expiration['expires_at'] | Date;
    quantity: Expiration['quantity'] | string;
    notes: Expiration['notes'];
    notification_days_before: Expiration['notification_days_before'] | string;
    notification_method: Expiration['notification_method'];
}>;

export default function CreateExpiration() {
    const { product: productString } = useLocalSearchParams<{ product?: string }>();

    const [product, setProduct] = useState<Product | null>(null);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        try {
            if (!productString) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error('Prodotto non trovato');
            }

            const parsedProduct = JSON.parse(productString) as Product;

            productsService
                .getProductById(parsedProduct.id)
                .then(({ data }) => {
                    setProduct(data);
                })
                .catch(async (err) => {
                    if (isAxiosError(err) && err.response?.status === 404) {
                        Alert.alert('Errore', 'Prodotto non trovato. Riprova.');

                        await removeFromRecent(parsedProduct.id);

                        router.back();
                    } else console.error(err);
                });
        } catch (err) {
            console.error(err);
            Alert.alert('Errore', 'Impossibile caricare il prodotto. Riprova.');
            router.replace('/(app)/(tabs)');
        }
    }, [productString]);

    const [form, setForm] = useState<ExpirationForm>({
        product_id: product?.id,
        expires_at: undefined,
        quantity: 1,
        notes: '',
        notification_days_before: 1,
        notification_method: 'both',
    });
    const [errors, setErrors] = useState<Record<keyof ExpirationForm, string> | null>(null);

    const setFormData = <T extends keyof typeof form>(key: T, value: (typeof form)[T]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        setFormData('product_id', product?.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.id]);

    const onSubmit = async () => {
        try {
            setErrors(null);
            setSubmitting(true);
            await expirationsService.createExpiration({
                ...form,
                expires_at: (form.expires_at as Date | undefined)?.toDateString(),
            });

            router.replace('/(app)/(tabs)');
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 422) {
                setErrors(
                    Object.fromEntries(Object.entries(e.response.data.errors as ValidationErrors).map(([key, value]) => [key, value[0]])) as Record<
                        keyof ExpirationForm,
                        string
                    >,
                );
            } else {
                console.error(e);
                Alert.alert('Errore', 'Impossibile creare la scadenza. Riprova.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const MethodButton = ({ value, label }: { value: ExpirationForm['notification_method']; label: string }) => (
        <TouchableOpacity
            onPress={() => setFormData('notification_method', value)}
            className={`flex-1 items-center justify-center rounded border px-3 py-2 ${
                form.notification_method === value ? 'border-emerald-700 bg-emerald-600' : 'border-gray-300 dark:border-gray-700'
            }`}
        >
            <Text className={`text-sm font-semibold ${form.notification_method === value ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const removeFromRecent = async (productId: Product['id']) => {
        await recentProductsService.removeRecent(productId);
    };

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-white px-4 dark:bg-gray-900">
            {product ? (
                <ProductCard product={product} />
            ) : (
                <View className="mb-2 h-[60px] rounded-lg bg-black/5 p-3 dark:bg-white/10">
                    <ActivityIndicator />
                </View>
            )}

            <View className="gap-3">
                <FormField label="Data di scadenza" error={errors?.expires_at}>
                    <Datepicker date={form.expires_at as Date | undefined} onDateChange={(date) => setFormData('expires_at', date)} />
                </FormField>

                <FormField label="Giorni prima per notifica" error={errors?.notification_days_before}>
                    <Input
                        value={form.notification_days_before?.toString() ?? ''}
                        onChangeText={(value) => setFormData('notification_days_before', value)}
                        className="h-12 rounded border border-gray-300 bg-white px-3 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        keyboardType="numeric"
                    />
                </FormField>

                <View className="gap-2">
                    <Text className="text-sm font-medium text-gray-800 dark:text-gray-200">Metodo di notifica</Text>
                    <View className="flex-row gap-2">
                        <MethodButton value="none" label="Nessuna" />
                        <MethodButton value="push" label="Push" />
                    </View>
                    <View className="mt-2 flex-row gap-2">
                        <MethodButton value="email" label="Email" />
                        <MethodButton value="both" label="Entrambi" />
                    </View>
                </View>

                <FormField label="Quantità (opzionale)" error={errors?.quantity}>
                    <Input
                        value={form.quantity?.toString() ?? ''}
                        onChangeText={(value) => setFormData('quantity', value)}
                        className="h-12 rounded border border-gray-300 bg-white px-3 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        keyboardType="numeric"
                    />
                </FormField>

                <FormField label="Note (opzionali)" error={errors?.notes}>
                    <Input
                        placeholder="Aggiungi note"
                        value={form.notes ?? ''}
                        onChangeText={(value) => setFormData('notes', value)}
                        className="min-h-12 rounded border border-gray-300 bg-white px-3 text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        multiline
                    />
                </FormField>

                <Spacer />

                <View className="mt-2 flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 items-center justify-center rounded border border-gray-300 py-3 dark:border-gray-700"
                    >
                        <Text className="font-semibold text-gray-800 dark:text-gray-200">Annulla</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onSubmit}
                        disabled={submitting}
                        className="flex-1 items-center justify-center rounded bg-emerald-600 py-3 disabled:opacity-60"
                    >
                        {submitting ? <ActivityIndicator color="#fff" /> : <Text className="font-semibold text-white">Crea scadenza</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
