import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/button';
import productsService from '@/services/products-service';
import Input from '@/components/input';
import { Product, ValidationErrors } from '@/types';
import { isAxiosError } from 'axios';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Picker } from '@react-native-picker/picker';
import { categories } from '@/lib/categories';

type ProductForm = Partial<{
    name: Product['name'];
    brand: Product['brand'];
    description: Product['description'];
    category: Product['category'];
}>;

export default function CreateProduct() {
    const { barcode } = useLocalSearchParams<{ barcode?: string }>();

    const colors = useThemeColors();

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState<Record<keyof ProductForm, string> | null>(null);

    const [form, setForm] = useState<ProductForm>({
        name: '',
        brand: '',
        description: '',
        category: '',
    });

    const setFormData = <T extends keyof typeof form>(key: T, value: (typeof form)[T]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onSubmit = async () => {
        setErrors(null);
        try {
            setLoading(true);

            const product = await productsService.createProduct(form);
            router.push({
                pathname: '/(app)/create-expiration',
                params: { product: JSON.stringify(product) },
            });
        } catch (e) {
            if (isAxiosError(e) && e.response?.status === 422) {
                setErrors(
                    Object.fromEntries(Object.entries(e.response.data.errors as ValidationErrors).map(([key, value]) => [key, value[0]])) as Record<
                        keyof ProductForm,
                        string
                    >,
                );
            } else {
                console.error(e);
                Alert.alert('Errore', 'Non è stato possibile creare il prodotto.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-4 dark:bg-gray-900">
            <View className="gap-3 pt-0">
                {barcode ? <Text className="text-gray-600 dark:text-gray-500">Barcode: {barcode}</Text> : null}

                <View className="gap-1">
                    <Text className="text-sm text-gray-700 dark:text-gray-400">Nome</Text>
                    <Input
                        value={form.name ?? ''}
                        onChangeText={(value) => setFormData('name', value)}
                        placeholder="Es. Latte intero 1L"
                        className="rounded-lg border border-gray-300 px-3 py-2"
                        error={errors?.name}
                    />
                </View>

                <View className="gap-1">
                    <Text className="text-sm text-gray-700 dark:text-gray-400">Marca (opzionale)</Text>
                    <Input
                        value={form.brand ?? ''}
                        onChangeText={(value) => setFormData('brand', value)}
                        placeholder="Es. Parmalat"
                        className="rounded-lg border border-gray-300 px-3 py-2"
                        error={errors?.brand}
                    />
                </View>

                <View className="gap-1">
                    <Text className="text-sm text-gray-700 dark:text-gray-400">Descrizione (opzionale)</Text>
                    <Input
                        value={form.description ?? ''}
                        onChangeText={(value) => setFormData('description', value)}
                        placeholder="Dettagli aggiuntivi"
                        className="rounded-lg border border-gray-300 px-3 py-2"
                        multiline
                        error={errors?.description}
                    />
                </View>

                <View className="mb-10 gap-1">
                    <Picker>
                        {categories.items.map((category) => (
                            <Picker.Item key={category.value} label={category.label} value={category.label} />
                        ))}
                    </Picker>
                </View>

                <Button title={loading ? 'Salvataggio...' : 'Crea prodotto'} onPress={onSubmit} loading={loading} />
            </View>
        </SafeAreaView>
    );
}
