import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, config } from 'rxjs';
import { User } from 'src/Models/user.model';
import { UserService } from '../user.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private userService: UserService) { 
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('bfdc_user')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User{
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.userService.ValidateLogin(username, password)
        .pipe(
          map(user => {
            if (user && user.data) {
                localStorage.setItem('bfdc_user', JSON.stringify(user.data.find(() => true)));
                this.currentUserSubject.next(user.data.find(() => true));
            }
            return user;
          })
        );
  }

  logout() {
    localStorage.removeItem('bfdc_user');
    this.currentUserSubject.next(null);
  }

}