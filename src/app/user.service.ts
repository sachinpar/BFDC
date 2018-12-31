import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { User } from '../Models/user.model'
import { Observable } from 'rxjs';
import { map } from 'rxjs-compat/operator/map';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: Observable<User[]>;
  constructor(private http: HttpClient) { }

  GetUsers()
  {
    this.users = this.http.get<User[]>('/api/Users')
            .pipe(map(res => res.json));
  }
}
