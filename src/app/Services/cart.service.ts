import { Injectable } from '@angular/core';
import { CartProduct } from 'src/Models/CartProduct';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  tempList: CartProduct[] = [];
  cartSubject: BehaviorSubject<CartProduct[]> = new BehaviorSubject<CartProduct[]>(this.tempList);
  cast$: Observable<CartProduct[]> = this.cartSubject.asObservable();

  constructor() { }

  UpdateCart(newCart){
    this.cartSubject.next(newCart);
  }

  ClearCart(){
    let emptyCart: CartProduct[] = [];
    this.cartSubject.next(emptyCart);
  }
}
