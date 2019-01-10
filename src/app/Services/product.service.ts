import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { IProductResponse } from 'src/Models/IProductResponse';
import { Product } from 'src/Models/Product'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  GetProducts(){
    return this.http.get<IProductResponse>('/api/products', httpOptions);
  }

  GetProduct(id: number){
    return this.http.get<IProductResponse>('/api/products/' + id, httpOptions);
  }

  AddProduct(product: Product){
    const body = {"product": product};
    return this.http.post<IProductResponse>('/api/products/add', body, httpOptions);
  }

  DeleteProduct(id: number){
    return this.http.delete<IProductResponse>('/api/products/delete/' + id, httpOptions);
  }

  UpdateProduct(product: Product){
    const body = product;
    return this.http.post<IProductResponse>('/api/products/update', body, httpOptions);
  }
}
