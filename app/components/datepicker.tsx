import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dates from '@/lib/dates';
import Input from '@/components/input';

type DatepickerProps = {
    error?: string;
    date: Date | undefined;
    onDateChange?: (date: Date | undefined) => void;
};

export function Datepicker({ date, onDateChange, error }: DatepickerProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TouchableOpacity onPress={() => setOpen(true)}>
                <Input error={error} readOnly value={dates.format(date)} />
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
        </>
    );
}
