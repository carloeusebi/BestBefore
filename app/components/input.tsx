import { TextInput, View } from 'react-native';
import { ComponentProps } from 'react';

type InputProps = ComponentProps<typeof TextInput>;

export default function Input({ className, ...props }: InputProps) {
    return (
        <View>
            <TextInput
                className={`h-12 rounded border border-gray-300 bg-white px-3 text-black placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white  ${className ?? ''}`}
                {...props}
            />
        </View>
    );
}
