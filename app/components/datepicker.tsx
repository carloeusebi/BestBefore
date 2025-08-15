import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dates from '@/lib/dates';
import Input from '@/components/input';

type DatepickerProps = {
    date: Date | undefined;
    onDateChange?: (date: Date | undefined) => void;
};

export function Datepicker({ date, onDateChange }: DatepickerProps) {
    const [open, setOpen] = useState(false);

    return (
        <View>
            <TouchableOpacity onPress={() => setOpen(true)}>
                <Input readOnly value={dates.format(date)} />
            </TouchableOpacity>
            {open && (
                <DateTimePicker
                    value={date ?? new Date()}
                    mode="date"
                    onChange={(_, date) => {
                        if (onDateChange) {
                            onDateChange(date);
                        }
                        setOpen(false);
                    }}
                />
            )}
        </View>
    );
}
