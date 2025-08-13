import { Product } from '@/types';
import { categories } from '@/lib/categories';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';

type ProductCardProps = { product: Product };

export default function ProductCard({ product }: ProductCardProps) {
    const category = categories.getCategory(product.category);
    const colors = useThemeColors();

    return (
        <View className="mb-2 rounded-lg bg-black/5 p-3 dark:bg-white/10">
            <View className="flex-row items-center gap-2">
                {category?.icon && <category.icon size={20} color={colors.text} />}
                <View className="flex-1">
                    <Text className="mb-1 text-base font-medium text-black dark:text-white">{product.name}</Text>
                    <View className="products-center flex-row gap-2">
                        {product.brand ? <Text className="text-xs text-gray-700 dark:text-gray-300">{product.brand}</Text> : null}
                        {category?.label ? <Text className="text-xs text-gray-600 dark:text-gray-400">• {category.label}</Text> : null}
                    </View>
                </View>
            </View>
        </View>
    );
}
