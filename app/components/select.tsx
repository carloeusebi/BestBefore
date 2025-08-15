import { Picker } from '@react-native-picker/picker';
import { ComponentProps } from 'react';
import { Text, View } from 'react-native';

type SelectProps<T, K extends keyof T> = {
    items: T[];
    selectedValue: T[K] | undefined | null;
    onValueChange: (value: T[K] | null) => void;
    valueKey?: K;
    labelKey?: keyof T;
} & Omit<ComponentProps<typeof Picker>, 'selectedValue' | 'onValueChange'>;

export default function Select<T, K extends keyof T>({
    selectedValue,
    onValueChange,
    items,
    valueKey = 'value' as K,
    labelKey = 'label' as keyof T,
    ...props
}: SelectProps<T, K>) {
    return (
        <View className="h-12 justify-center rounded border border-gray-300 bg-white text-black placeholder:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500">
            <Picker
                {...props}
                prompt="Categoria"
                selectedValue={selectedValue}
                onValueChange={(value) => {
                    if (onValueChange) {
                        onValueChange(value);
                    }
                }}
            >
                <Picker.Item key="0" label="" value={null} />
                {items.map((item) => (
                    <Picker.Item key={item[valueKey] as string} label={item[labelKey] as string} value={item[valueKey]} />
                ))}
            </Picker>
        </View>
    );
}
