export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    notifyByEmail?: boolean;
    notifyByPush?: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string | null;
    barcode: string | null;
    brand: string | null;
}

export type NotificationMethod = 'none' | 'push' | 'email' | 'both';

export type ValidationErrors = {
    [key: string]: string[];
};

export interface Expiration {
    id: string;
    expires_at: string; // ISO date string (YYYY-MM-DD)
    quantity: number;
    notes: string | null;
    notification_days_before?: number;
    notification_method?: NotificationMethod;
    created_at?: string;
    updated_at?: string;
    user_id: string;
    product_id: string;
    product?: Product;
    user?: User;
}
