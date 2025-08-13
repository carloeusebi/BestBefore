import { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/button';
import productsService from '@/services/products-service';

export default function CreateProduct() {
    const { barcode } = useLocalSearchParams<{ barcode?: string }>();
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!name.trim()) {
            Alert.alert('Nome richiesto', 'Inserisci il nome del prodotto.');
            return;
        }
        try {
            setLoading(true);
            const payload: { name: string; description?: string; brand?: string; barcode?: string } = {
                name: name.trim(),
            };
            const b = brand.trim();
            const d = description.trim();
            if (b) payload.brand = b;
            if (d) payload.description = d;
            if (typeof barcode === 'string' && barcode.length > 0) {
                payload.barcode = barcode;
            }
            const product = await productsService.createProduct(payload);
            router.push({
                pathname: '/(app)/create-expiration',
                params: { product: JSON.stringify(product) },
            });
        } catch (e) {
            console.error(e);
            Alert.alert('Errore', 'Non è stato possibile creare il prodotto.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-4 dark:bg-gray-900">
            <View className="gap-3 pt-0">
                <Text className="text-lg font-semibold">Nuovo prodotto</Text>
                {barcode ? <Text className="text-gray-600">Barcode: {barcode}</Text> : null}

                <View className="gap-1">
                    <Text className="text-sm text-gray-700">Nome</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Es. Latte intero 1L"
                        className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                </View>

                <View className="gap-1">
                    <Text className="text-sm text-gray-700">Marca (opzionale)</Text>
                    <TextInput
                        value={brand}
                        onChangeText={setBrand}
                        placeholder="Es. Parmalat"
                        className="rounded-lg border border-gray-300 px-3 py-2"
                    />
                </View>

                <View className="gap-1">
                    <Text className="text-sm text-gray-700">Descrizione (opzionale)</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Dettagli aggiuntivi"
                        className="rounded-lg border border-gray-300 px-3 py-2"
                        multiline
                    />
                </View>

                <Button title={loading ? 'Salvataggio...' : 'Crea prodotto'} onPress={onSubmit} loading={loading} />
            </View>
        </SafeAreaView>
    );
}
