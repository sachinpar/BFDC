import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/Services/cart.service';
import { CartProduct } from 'src/Models/CartProduct';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Customer } from 'src/Models/Customer';
import { CustomerService } from 'src/app/Services/customer.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.css']
})
export class ViewCartComponent implements OnInit {
  cart: CartProduct[] = [];
  customers: Customer[] = [];
  customerCtrl = new FormControl();
  filteredCustomers: Observable<Customer[]>;

  constructor(private cartService: CartService, private customerService: CustomerService) { }

  ngOnInit() {
    this.cartService.cast$.subscribe((cart) =>{
      this.cart = cart;
    });
    this.customerService.GetCustomers().subscribe((response) => {
      this.customers = response.data;
      this.filteredCustomers = this.customerCtrl.valueChanges
        .pipe(
          startWith(''),
          map(customer => customer ? this._filterCustomers(customer) : this.customers.slice())
        );
    });
  }

  private _filterCustomers(value: string): Customer[] {
    if(typeof(value) != "string"){
      value = String(value);
    }
    const filterValue = value.toLowerCase();
    return this.customers.filter(customer => customer.name.toLowerCase().includes(filterValue));
  }

}
