import { Order } from './Order';

export interface IOrderResponse{
    status: number;
    data: Array<Order>;
    message: string;
}