import React from 'react';
import { Text, View } from 'react-native';
import { AlertCircleIcon } from 'lucide-react-native';

type FormFieldProps = {
    error?: string;
    label?: string;
    children?: React.ReactNode;
};

export function FormField({ error, label, children }: FormFieldProps) {
    const field = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            const existing = (child.props as any).className;
            if (error) {
                const withBorder = `${existing} !border !border-red-500`.trim();

                // @ts-ignore
                return React.cloneElement(child, { className: withBorder });
            }
        }
        return child;
    });
    return (
        <View className="gap-1" style={{ position: 'relative' }}>
            {label && <Text className="text-sm text-gray-700 dark:text-gray-400">{label}</Text>}
            {field}
            {error && <Text className="text-xs text-red-500">{error}</Text>}
            {error && (
                <AlertCircleIcon
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: 10,
                        transform: [{ translateY: '-50%' }],
                    }}
                    size={16}
                    color="red"
                />
            )}
        </View>
    );
}
