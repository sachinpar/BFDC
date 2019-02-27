import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { CartService } from '../Services/cart.service';
import { CartProduct } from 'src/Models/CartProduct';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent implements OnInit {
  cart: CartProduct[];

  constructor(public router: Router, private authService: AuthService, private cartService: CartService) { }

  ngOnInit() {
    this.cartService.cast$.subscribe((cart) =>{
      this.cart = cart;
    });
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