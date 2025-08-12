import { Text, View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Button } from '@/components/button';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import productsService from '@/services/products-service';

export default function Scan() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [barcode, setBarcode] = useState<string>('');
    const [isCameraActive, setIsCameraActive] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        setIsCameraActive(isFocused);
        return () => {
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

    const onBarcodeScanned = async (result: BarcodeScanningResult) => {
        if (scanned) return;

        setScanned(true);
        setBarcode(result.data);

        try {
            const product = await productsService.findProduct(barcode);
            console.log(product);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            {isCameraActive && (
                <CameraView
                    style={styles.camera}
                    facing="back"
                    barcodeScannerSettings={{
                        barcodeTypes: ['ean13', 'code128'],
                    }}
                    onBarcodeScanned={onBarcodeScanned}
                >
                    {scanned && (
                        <View style={styles.scannedContainer}>
                            <Text style={styles.scannedText}>Barcode: {barcode}</Text>
                            <Button onPress={() => setScanned(false)} title="Tap to Scan Again" />
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
