import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from 'src/Models/user.model';
import { IUserResponse } from 'src/Models/IUserResponse';
import { MatSnackBar } from '@angular/material'
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  
  public username: string;
  public password: string;
  public showSpinner: boolean = false;

  constructor(private userService: UserService, public snackBar: MatSnackBar, public router: Router) { }

  ngOnInit() {
  }

  ValidateLogin(){
    this.showSpinner = true;
    this.userService.ValidateLogin(this.username, this.password).subscribe((response) => {
      this.showSpinner = false;
      if(response.status == 200)
      {
        this.openSnackBar("Login Successful", "Close");
        this.router.navigateByUrl('home');
      }
      else
      {
        this.openSnackBar(response.message, "Close");
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
