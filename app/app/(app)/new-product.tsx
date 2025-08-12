import { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/button';
import productsService from '@/services/products-service';

export default function NewProduct() {
    const { barcode } = useLocalSearchParams<{ barcode?: string }>();
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!barcode) {
            Alert.alert('Barcode mancante', 'Torna alla scansione e riprova.');
            return;
        }
        if (!name.trim()) {
            Alert.alert('Nome richiesto', 'Inserisci il nome del prodotto.');
            return;
        }
        try {
            setLoading(true);
            await productsService.createProductForBarcode({
                barcode,
                name: name.trim(),
                brand: brand.trim() || undefined,
                description: description.trim() || undefined,
            });
            Alert.alert('Prodotto creato', 'Il prodotto è stato creato con successo.');
            router.back();
        } catch (e) {
            console.error(e);
            Alert.alert('Errore', 'Non è stato possibile creare il prodotto.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <View className="gap-3 p-4">
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
