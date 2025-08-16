import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/button';
import productsService from '@/services/products-service';
import Input from '@/components/input';
import { Product, ValidationErrors } from '@/types';
import { isAxiosError } from 'axios';
import { categories } from '@/lib/categories';
import Select from '@/components/select';
import { FormField } from '@/components/form-field';

type ProductForm = Partial<{
    name: Product['name'];
    brand: Product['brand'];
    barcode: string;
    description: Product['description'];
    category: Product['category'];
}>;

export default function CreateProduct() {
    const { barcode } = useLocalSearchParams<{ barcode?: string }>();

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState<Record<keyof ProductForm, string> | null>(null);

    const [form, setForm] = useState<ProductForm>({
        name: '',
        brand: '',
        barcode,
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

                <FormField label="Nome" error={errors?.name}>
                    <Input value={form.name ?? ''} onChangeText={(value) => setFormData('name', value)} placeholder="Es. Latte intero 1L" />
                </FormField>

                <FormField label="Marca (opzionale)" error={errors?.brand}>
                    <Input value={form.brand ?? ''} onChangeText={(value) => setFormData('brand', value)} placeholder="Es. Parmalat" />
                </FormField>

                <FormField label="Descrizione (opzionali)" error={errors?.description}>
                    <Input
                        value={form.description ?? ''}
                        onChangeText={(value) => setFormData('description', value)}
                        placeholder="Dettagli aggiuntivi"
                        multiline
                    />
                </FormField>

                <FormField label="Categoria" error={errors?.category}>
                    <Select
                        items={categories.items}
                        selectedValue={form.category}
                        onValueChange={(value) => setFormData('category', value)}
                        valueKey="value"
                    />
                </FormField>

                <View className="mt-10">
                    <Button title={loading ? 'Salvataggio...' : 'Crea prodotto'} onPress={onSubmit} loading={loading} />
                </View>
            </View>
        </SafeAreaView>
    );
}
