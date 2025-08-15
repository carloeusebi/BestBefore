import axiosInstance from '@/config/axios-config';
import { Expiration, LaravelPaginatedResponse } from '@/types';

type Payload = Partial<Record<keyof Expiration, unknown>>;

const endpoint = 'api/expirations';

export default {
    async getExpirations(page?: number, filters?: { product?: string }) {
        const params: Record<string, unknown> = {};
        if (page) params.page = page;
        if (filters?.product) params.product = filters.product;
        const { data } = await axiosInstance.get<LaravelPaginatedResponse<Expiration>>(endpoint, {
            params: Object.keys(params).length ? params : undefined,
        });
        return data;
    },

    async createExpiration(payload: Payload) {
        const { data } = await axiosInstance.post<Expiration>(endpoint, payload);
        return data;
    },

    async updateExpiration(expiration: Expiration['id'], payload: Payload) {
        const { data } = await axiosInstance.patch<Expiration>(`${endpoint}/${expiration}`, payload);

        return data;
    },

    async deleteExpiration(expiration: Expiration['id']) {
        await axiosInstance.delete(`${endpoint}/${expiration}`);
    },
};
