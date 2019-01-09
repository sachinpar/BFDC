import { Customer } from './Customer'

export interface ICustomerResponse{
    status: number;
    data: Array<Customer>;
    message: string;
}