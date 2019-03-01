import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { IOrderResponse } from 'src/Models/ResponseModels/IOrderResponse';
import { Order } from 'src/Models/Order'
import { CartProduct } from 'src/Models/CartProduct';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  GetOrders(){
    return this.http.get<IOrderResponse>('/api/orders', httpOptions);
  }

  GetOrder(id: number){
    return this.http.get<IOrderResponse>('/api/orders/' + id, httpOptions);
  }

  AddOrder(order: CartProduct[]){
    const body = {"order": order};
    return this.http.post<IOrderResponse>('/api/orders/add', body, httpOptions);
  }

  DeleteOrder(id: number){
    return this.http.delete<IOrderResponse>('/api/orders/delete/' + id, httpOptions);
  }

  UpdateOrder(order: Order){
    const body = JSON.stringify(order);
    return this.http.post<IOrderResponse>('/api/orders/update', body, httpOptions);
  }
}
