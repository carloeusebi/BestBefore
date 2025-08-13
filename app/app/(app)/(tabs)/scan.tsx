import { Text, View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Button } from '@/components/button';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import productsService from '@/services/products-service';
import { Product } from '@/types';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';

export default function Scan() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [barcode, setBarcode] = useState<string>('');
    const [isCameraActive, setIsCameraActive] = useState(true);
    const [products, setProducts] = useState<Product[] | null>(null);
    const [showChoice, setShowChoice] = useState(false);
    const [showNoProducts, setShowNoProducts] = useState(false);
    const isFocused = useIsFocused();

    const onBarcodeScanned = async (result: BarcodeScanningResult) => {
        if (scanned) return;

        setScanned(true);

        const scannedCode = result.data;
        setBarcode(scannedCode);

        try {
            const found = await productsService.findProductsByBarcode(scannedCode);
            setProducts(found);
            if (found && found.length > 0) {
                setShowChoice(true);
            } else {
                setShowNoProducts(true);
            }
        } catch (error) {
            if (isAxiosError(error) && error.response?.status !== 404) {
                console.error(error);
                Alert.alert('Si è verificato un errore inatteso.');
            }
            setShowNoProducts(true);
        }
    };

    useEffect(() => {
        setIsCameraActive(isFocused);
        return () => {
            setScanned(false);
            setIsCameraActive(false);
        };
    }, [isFocused]);

    if (!permission) {
        return <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900" />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 items-center justify-center gap-3 bg-white dark:bg-gray-900">
                <Text>Per continuare ci servono i permessi per la fotocamera</Text>
                <Button variant="primary" onPress={requestPermission} title="Richiedi i permessi" />
            </View>
        );
    }

    const resetScan = () => {
        setScanned(false);
        setBarcode('');
        setProducts(null);
        setShowChoice(false);
        setShowNoProducts(false);
    };

    const onChooseProduct = (product: Product) => {
        const params = { product: JSON.stringify(product) };

        router.navigate({ pathname: '/(app)/create-expiration', params });
    };

    const onCreateNewProduct = () => {
        router.push({ pathname: '/(app)/create-product', params: barcode ? { barcode } : undefined });
    };

    return (
        <SafeAreaView edges={['top']} className="flex-1 justify-center">
            {isCameraActive && (
                <CameraView
                    style={styles.camera}
                    facing="back"
                    barcodeScannerSettings={{
                        barcodeTypes: ['ean13', 'code128'],
                    }}
                    onBarcodeScanned={onBarcodeScanned}
                >
                    {showChoice && products && products.length > 0 && (
                        <View className="absolute bottom-[100px] left-5 right-5 max-h-[80%] gap-2 rounded-lg bg-white/95 p-4">
                            <Text className="text-lg font-semibold text-black">Seleziona il prodotto</Text>
                            <Text>{barcode}</Text>
                            <ScrollView className="my-2">
                                {products.map((p) => (
                                    <TouchableOpacity key={p.id} onPress={() => onChooseProduct(p)}>
                                        <View key={p.id} className="mb-2 rounded-lg bg-black/5 p-3">
                                            <Text className="mb-1 text-base font-medium text-black">{p.name}</Text>
                                            {p.brand ? <Text className="mb-2 text-xs text-gray-700">{p.brand}</Text> : null}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <Button variant="primary" title="Crea nuovo prodotto con questo Barcode" onPress={onCreateNewProduct} />
                            <Button variant="secondary" title="Riprova" onPress={resetScan} />
                        </View>
                    )}

                    {showNoProducts && (
                        <View className="absolute bottom-[100px] left-5 right-5 max-h-[60%] gap-2 rounded-lg bg-white/95 p-4">
                            <Text className="mb-2 text-lg font-semibold text-black">Nessun prodotto trovato</Text>
                            <Text className="mb-3 text-sm text-black">Vuoi creare un nuovo prodotto per il barcode {barcode}?</Text>
                            <Button variant="primary" title="Crea nuovo prodotto" onPress={onCreateNewProduct} />
                            <Button variant="secondary" title="Riprova" onPress={resetScan} />
                        </View>
                    )}
                </CameraView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    scannedContainer: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    scannedText: {
        fontSize: 16,
        color: '#000',
        marginBottom: 10,
    },
});
