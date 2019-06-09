import { Injectable, EventEmitter } from '@angular/core';
import { Product } from 'src/Models/Product';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsListNavService {

  tempProduct: Product = null;
  productSubject: BehaviorSubject<Product> = new BehaviorSubject<Product>(this.tempProduct);
  productNav$: Observable<Product> = this.productSubject.asObservable();

  constructor() { }

  SendProductData(product: Product){
    this.productSubject.next(product);
  }
}
