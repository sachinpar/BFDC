import { OrderItem } from '../OrderItem';

export interface IOrderItemResponse{
    status: number;
    data: Array<OrderItem>;
    message: string;
}