export interface OrderItem{
    _id: number;
    order_id: number;
    customer_id: number;
    size_id: number;
    product_id: number;
    product_name?: string;
    customer_name?: string;
    size?: string;
    quantity: number;
}