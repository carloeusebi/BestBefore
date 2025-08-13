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
