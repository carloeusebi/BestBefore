import axiosInstance from '@/config/axios-config';
import { Product } from '@/types';

export default {
    async findProductsByBarcode(barcode: string) {
        const { data } = await axiosInstance.get<Product[]>(`/api/barcodes/${barcode}/products`);
        return data;
    },
    async searchProducts(query: string) {
        if (!query || query.trim().length === 0) return [] as Product[];
        const { data } = await axiosInstance.get<Product[]>(`/api/products`, { params: { q: query } });
        return data ?? [];
    },
    async createProduct(payload: Partial<Product>) {
        const { data } = await axiosInstance.post<{ data: Product }>(`/api/products`, payload);
        return data.data;
    },
    async createProductForBarcode(payload: { name: string; barcode: string; description?: string | null; brand?: string | null }) {
        const { data } = await axiosInstance.post<{ data: Product }>(`/api/products`, payload);
        return data.data;
    },
    async getProductById(productId: Product['id']) {
        return await axiosInstance.get<Product>(`/api/products/${productId}`);
    },
};
