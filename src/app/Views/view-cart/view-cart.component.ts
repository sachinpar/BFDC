import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/Services/cart.service';
import { CartProduct } from 'src/Models/CartProduct';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Customer } from 'src/Models/Customer';
import { CustomerService } from 'src/app/Services/customer.service';
import { startWith, map } from 'rxjs/operators';
import { Order } from 'src/Models/Order';
import { OrderService } from 'src/app/Services/order.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

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
  showSpinner: boolean = false;
  existingCustomer: boolean = false;
  customerId: number;

  constructor(private cartService: CartService, private customerService: CustomerService, private orderService: OrderService, public snackBar: MatSnackBar, public router: Router) { }

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

  OnCustomerSelected(id){
    let customer = this.customers.find(s => s._id == id);
    this.customerCtrl.setValue(customer.name);
    this.customerId = id;
    this.existingCustomer = true;
  }

  PlaceOrder(){
    this.showSpinner = true;
    let customer: Customer;
    if(this.existingCustomer == true){
      customer = this.customers.find(s => s.name == this.customerCtrl.value);
      this.CreateOrder(customer);
    }
    else{
      this.AddNewCustomer();
    }
  }

  AddNewCustomer(): Customer{
    let customer: Customer = {
      _id: 0,
      name: this.customerCtrl.value
    }
    let newCustomer: Customer;
    this.customerService.AddCustomer(customer).subscribe((response) => {
      if(response.status == 200){
        this.customerService.GetCustomers().subscribe((customerResponse) => {
          if(customerResponse.status == 200){
            newCustomer = customerResponse.data.find(s => s.name == this.customerCtrl.value);
            this.CreateOrder(newCustomer);
          }
        });
      }
    });
    return newCustomer;
  }

  CreateOrder(customer: Customer){
    if(customer != null && customer._id > 0){
      let i=0;
      // for(i=0; i<this.cart.length; i++){
      //   let order: Order;
      //   order = {
      //     _id: 0,
      //     customer_id: customer._id,
      //     product_id: this.cart[i].product_id,
      //     quantity: this.cart[i].quantity,
      //     amount: 0,
      //     order_date: new Date(),
      //     returned: false,
      //     return_date: null
      //   }
      // }
      this.orderService.AddOrder(this.cart).subscribe((response) => {
        if(response.status == 200){
          this.showSpinner = false;
          this.openSnackBar("Order placed successfully", "Close");
          this.router.navigateByUrl('home');
        }
        else{
          this.openSnackBar(response.message, "Close");
        }
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
