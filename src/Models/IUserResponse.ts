import { User } from './user.model';

export interface IUserResponse{
    status: number,
    data: Array<User>,
    message: string
}