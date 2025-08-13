import { Text, TextInput, View } from 'react-native';
import { ComponentProps } from 'react';
import { AlertCircleIcon } from 'lucide-react-native';

type InputProps = {
    error?: string;
} & ComponentProps<typeof TextInput>;

export default function Input({ error, className, ...props }: InputProps) {
    return (
        <View style={{ position: 'relative' }}>
            <TextInput
                className={`h-12 rounded border border-gray-300 bg-white px-3 text-black placeholder:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 ${!!error ? '!border-red-500 pe-8' : ''} ${className ?? ''}`}
                {...props}
            />
            {error && (
                <AlertCircleIcon
                    style={{
                        position: 'absolute',
                        top: '38%',
                        right: 10,
                        transform: [{ translateY: '-50%' }],
                    }}
                    size={16}
                    color="red"
                />
            )}
            {error && <Text className="text-xs text-red-500">{error}</Text>}
        </View>
    );
}
