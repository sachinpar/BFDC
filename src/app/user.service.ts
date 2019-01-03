import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { IUserResponse } from 'src/Models/IUserResponse';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private http: HttpClient) { }

  GetUsers()
  {
    return this.http.get<IUserResponse>('/api/Users', httpOptions);
  }

  GetUser(username : string)
  {
    return this.http.get<IUserResponse>('/api/Users/' + username, httpOptions);
  }

  ValidateLogin(userName : string, pwd: string)
  {
    const body = { username: userName, password: pwd };
    return this.http.post<IUserResponse>('/api/ValidateUser', body, httpOptions);
  }
}
