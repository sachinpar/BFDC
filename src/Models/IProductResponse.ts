import { Product } from './Product';

export interface IProductResponse{
    status: number;
    data: Array<Product>;
    message: string;
}