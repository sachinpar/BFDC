export interface Order{
    _id: number;
    customer_id: number;
    customer_name?: string;
    quantity: number;
    days?: number;
    amount?: number;
    order_date?: Date;
    returned?: boolean;
    return_date?: Date;
}