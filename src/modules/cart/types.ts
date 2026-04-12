/**
 * Типы для модуля корзины
 */

export interface CartItem {
    product_id: number;
    title: string;
    price: number;
    image_path: string;
    seller_id: number;
    seller_name: string;
    location?: string;
}

export interface CartResponse {
    items: CartItem[];
    total_price: number;
}

export interface SellerContact {
    id: number;
    name: string;
    email: string;
}

export interface CheckoutResponse {
    order_ids: number[];
    sellers: Record<string, SellerContact>;
}

export interface CartSellerGroup {
    seller_name: string;
    seller_id: number;
    items: CartItem[];
}
