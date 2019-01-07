import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { IItemResponse } from 'src/Models/IItemResponse';
import { Item } from 'src/Models/Item'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  GetItems(){
    return this.http.get<IItemResponse>('/api/items', httpOptions);
  }

  GetItem(id: number){
    return this.http.get<IItemResponse>('/api/items/' + id, httpOptions);
  }

  AddItem(item: Item){
    const body = JSON.stringify(item);
    return this.http.post<IItemResponse>('/api/items/add', body, httpOptions);
  }

  DeleteItem(id: number){
    return this.http.delete<IItemResponse>('/api/items/delete/' + id, httpOptions);
  }

  UpdateItem(item: Item){
    const body = JSON.stringify(item);
    return this.http.post<IItemResponse>('/api/items/update', body, httpOptions);
  }
}
