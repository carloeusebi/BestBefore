import { Text, View, StyleSheet, ScrollView, Alert, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Button } from '@/components/button';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import productsService from '@/services/products-service';
import { Product } from '@/types';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import { ZapIcon, ZapOffIcon } from 'lucide-react-native';

type Point = { x: number; y: number };

export default function Scan() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [barcode, setBarcode] = useState<string>('');
    const [isCameraActive, setIsCameraActive] = useState(true);
    const [products, setProducts] = useState<Product[] | null>(null);
    const [showChoice, setShowChoice] = useState(false);
    const [showNoProducts, setShowNoProducts] = useState(false);
    const isFocused = useIsFocused();
    const [torchOn, setTorchOn] = useState(false);

    // Camera and overlay layout
    const [cameraSize, setCameraSize] = useState<{ width: number; height: number } | null>(null);

    // Compute a barcode-shaped overlay rect (wide and short) in the center of the camera view
    const overlayRect = useMemo(() => {
        if (!cameraSize) return null;
        const width = Math.round(cameraSize.width * 0.85);
        const height = Math.round(Math.min(140, cameraSize.height * 0.22));
        const x = Math.round((cameraSize.width - width) / 2);
        const y = Math.round((cameraSize.height - height) / 2);
        return { x, y, width, height };
    }, [cameraSize]);

    const onCameraLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setCameraSize({ width, height });
    };

    const getBarcodeCenter = (result: BarcodeScanningResult): Point | null => {
        // Try to get center from cornerPoints if available
        const anyResult: any = result as any;
        const corners: Point[] | undefined = anyResult?.cornerPoints || anyResult?.corners || anyResult?.cornerPointsArray;
        if (Array.isArray(corners) && corners.length > 0) {
            const sum = corners.reduce((acc, p) => ({ x: acc.x + (p?.x ?? 0), y: acc.y + (p?.y ?? 0) }), {
                x: 0,
                y: 0,
            });
            return { x: sum.x / corners.length, y: sum.y / corners.length };
        }
        // Fallback to bounds if present (iOS often provides this)
        const bounds = anyResult?.bounds || anyResult?.boundingBox;
        if (bounds && bounds.origin && bounds.size) {
            return {
                x: bounds.origin.x + bounds.size.width / 2,
                y: bounds.origin.y + bounds.size.height / 2,
            };
        }
        // Android sometimes supplies { left, top, right, bottom }
        if (bounds && bounds.left != null) {
            return {
                x: (bounds.left + bounds.right) / 2,
                y: (bounds.top + bounds.bottom) / 2,
            } as any;
        }
        return null;
    };

    const isInsideOverlay = (point: Point | null) => {
        if (!overlayRect || !point) return false;
        return (
            point.x >= overlayRect.x &&
            point.x <= overlayRect.x + overlayRect.width &&
            point.y >= overlayRect.y &&
            point.y <= overlayRect.y + overlayRect.height
        );
    };

    const onBarcodeScanned = async (result: BarcodeScanningResult) => {
        if (scanned) return;
        // Only proceed if the barcode center lies within the overlay rect
        const center = getBarcodeCenter(result);
        if (!isInsideOverlay(center)) {
            return;
        }

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
            setTorchOn(false);
        };
    }, [isFocused]);

    if (!permission) {
        return <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900" />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 items-center justify-center gap-3 bg-white dark:bg-gray-900">
                <Text className="text-gray-800 dark:text-gray-300">Per continuare ci servono i permessi per la fotocamera</Text>
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
                    enableTorch={torchOn}
                    barcodeScannerSettings={{
                        barcodeTypes: ['ean13', 'code128'],
                    }}
                    onBarcodeScanned={onBarcodeScanned}
                    onLayout={onCameraLayout}
                >
                    <TouchableOpacity
                        onPress={() => setTorchOn((prev) => !prev)}
                        className="absolute left-10 top-10 flex size-16 items-center justify-center rounded-full bg-black/60"
                    >
                        {torchOn ? <ZapOffIcon color="white" /> : <ZapIcon color="white" />}
                    </TouchableOpacity>
                    {/* Barcode-shaped overlay */}
                    {overlayRect && (
                        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
                            {/* Shaded areas */}
                            <View style={[styles.shade, { top: 0, left: 0, right: 0, height: overlayRect.y }]} />
                            <View
                                style={[
                                    styles.shade,
                                    {
                                        top: overlayRect.y,
                                        left: 0,
                                        width: overlayRect.x,
                                        height: overlayRect.height,
                                    },
                                ]}
                            />
                            <View
                                style={[
                                    styles.shade,
                                    {
                                        top: overlayRect.y,
                                        left: overlayRect.x + overlayRect.width,
                                        right: 0,
                                        height: overlayRect.height,
                                    },
                                ]}
                            />
                            <View
                                style={[
                                    styles.shade,
                                    {
                                        top: overlayRect.y + overlayRect.height,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                    },
                                ]}
                            />

                            {/* Cutout border */}
                            <View
                                style={[
                                    styles.cutout,
                                    {
                                        top: overlayRect.y,
                                        left: overlayRect.x,
                                        width: overlayRect.width,
                                        height: overlayRect.height,
                                    },
                                ]}
                            />

                            {/* Helper text */}
                            <View
                                style={{
                                    position: 'absolute',
                                    top: overlayRect.y - 40,
                                    left: 0,
                                    right: 0,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={styles.helperText}>Allinea il codice a barre all&apos;interno del riquadro</Text>
                            </View>
                        </View>
                    )}

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
                        <View className="absolute bottom-[100px] left-5 right-5 max-h-[60%] gap-2 rounded-lg bg-white/95 p-4 dark:bg-gray-800">
                            <Text className="mb-2 text-lg font-semibold text-black dark:text-gray-200">Nessun prodotto trovato</Text>
                            <Text className="mb-3 text-sm text-black dark:text-gray-300">
                                Vuoi creare un nuovo prodotto per il barcode {barcode}?
                            </Text>
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
    shade: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    cutout: {
        position: 'absolute',
        borderColor: '#22c55e',
        borderWidth: 2,
        borderRadius: 8,
    },
    helperText: {
        color: '#fff',
        fontSize: 14,
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowRadius: 6,
    },
});
