import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from 'src/Models/user.model';
import { IUserResponse } from 'src/Models/IUserResponse';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  public username: string;
  public password: string;
  public users: Array<User>;
  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  ValidateLogin(){
    this.userService.GetUser('admin').subscribe((response) => {
      if(response.status = 200)
      {
        this.users = response.data;
      }
    });
  }

}
