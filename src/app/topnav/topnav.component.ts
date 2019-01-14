import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent implements OnInit {

  constructor(public router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  AddItem(){
    this.router.navigate(['additem']);
  }

  BookItem(){
    this.router.navigate([{ outlets: {mainOutlet: 'additem'}}]);
  }

  Logout(){
    this.authService.logout();
    this.router.navigateByUrl('');
  }
}