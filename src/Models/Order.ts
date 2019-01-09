export interface Order{
    _id: number;
    customer_id: number;
    item_id: number;
    quantity: number;
    days: number;
    amount: number;
    order_date: Date;
    returned: boolean;
    return_date: Date;
}