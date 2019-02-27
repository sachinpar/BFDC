import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { Size } from 'src/Models/Size';
import { ISizeResponse } from 'src/Models/ResponseModels/ISizeResponse';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class SizeService {

  constructor(private http: HttpClient) { }

  GetSizes(){
    return this.http.get<ISizeResponse>('/api/sizes', httpOptions);
  }

  GetSize(id: number){
    return this.http.get<ISizeResponse>('/api/sizes/' + id, httpOptions);
  }

  GetProductSizes(id: number){
    return this.http.get<ISizeResponse>('api/sizes/product/' + id, httpOptions);
  }

  AddSize(size: Size){
    const body = {"size": size};
    return this.http.post<ISizeResponse>('/api/sizes/add', body, httpOptions);
  }

  DeleteSize(id: number){
    return this.http.delete<ISizeResponse>('/api/sizes/delete/' + id, httpOptions);
  }

  UpdateSize(size: Size){
    const body = size;
    return this.http.post<ISizeResponse>('/api/sizes/update', body, httpOptions);
  }
}
