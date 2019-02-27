import { Size } from './Size';

export interface Product{
    _id: number;
    name: string;
    color: string;
    price: number;
    rent: number;
    quantity_left: number;
    image_name: string;
    image_url?: string;
    sizes?: Size[];
}