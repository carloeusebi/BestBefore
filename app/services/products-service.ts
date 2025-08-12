import axiosInstance from '@/config/axios-config';
import { Product } from '@/types';

export default {
    async findProduct(barcode: string) {
        const { data } = await axiosInstance.get<Product[]>(`/api/barcodes/${barcode}/products`);
        console.log(data);
        return data;
    },
};
