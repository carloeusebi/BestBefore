import axiosInstance from '@/config/axios-config';
import { Expiration } from '@/types';

export default {
    async createExpiration(payload: Partial<Record<keyof Expiration, unknown>>): Promise<Expiration> {
        const { data } = await axiosInstance.post<Expiration>('/api/expirations', payload);
        return data;
    },
};
