import { Size } from '../Size'

export interface ISizeResponse{
    status: number;
    data: Array<Size>;
    message: string;
}