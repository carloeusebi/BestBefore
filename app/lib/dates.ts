const dates = {
    format(date: Date | string | undefined): string {
        if (!date) return '';

        if (typeof date === 'string') {
            date = new Date(date);

            if (isNaN(date.getTime())) {
                throw new Error('Invalid date passed to dates.format: ' + date);
            }
        }

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();

        return `${day}/${month}/${year}`;
    },
};

export default dates;
