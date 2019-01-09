import { Item } from './Item';

export interface IItemResponse{
    status: number;
    data: Array<Item>;
    message: string;
}