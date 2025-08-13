import axiosInstance from '@/config/axios-config';
import { User } from '@/types';

export default {
    async updateSettings(payload: { notify_by_email?: boolean; notify_by_push?: boolean }): Promise<User> {
        const { data } = await axiosInstance.patch<User>('/api/auth/user', payload);
        return data;
    },
};
