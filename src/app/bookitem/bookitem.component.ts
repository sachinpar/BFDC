import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Item } from 'src/Models/Item';
import {map, startWith} from 'rxjs/operators';
import { ItemService } from '../Services/item.service';
import { Router } from '@angular/router';
import { OrderService } from '../Services/order.service';
import { Order } from 'src/Models/Order';
import { CustomerService } from '../Services/customer.service';
import { Customer } from 'src/Models/Customer';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-bookitem',
  templateUrl: './bookitem.component.html',
  styleUrls: ['./bookitem.component.css']
})
export class BookitemComponent implements OnInit{

  stateCtrl = new FormControl();
  quantityFormControl = new FormControl();
  filteredProducts: Observable<Item[]>;
  products: Item[] =[];

  order: Order;
  selectedProduct: Item;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  customerAddress: string;
  quantity: number;
  days: number;
  rent: number;
  amount: number;

  showSpinner:boolean = false;
  productQuantity: number;
  invalidQuantity: boolean = false;

  constructor(public itemService: ItemService, private orderService: OrderService, private customerService: CustomerService, public snackBar: MatSnackBar, public router: Router) {

  }

  ngOnInit() {
    this.itemService.GetItems().subscribe((response) => {
      this.products = response.data;
      this.filteredProducts = this.stateCtrl.valueChanges
        .pipe(
          startWith(''),
          map(product => product ? this._filterProducts(product) : this.products.slice())
        );
    });
  }

  private _filterProducts(value: string): Item[] {
    console.log(typeof(value));
    if(typeof(value) != "string"){
      value = String(value);
    }
    const filterValue = value.toLowerCase();
    return this.products.filter(product => product.name.toLowerCase().includes(filterValue) || product.color.toLowerCase().includes(filterValue));
  }

  OnProductSelected(event){
    this.ClearInputs();
    this.selectedProduct = this.products.find(s => s._id == event);
    this.stateCtrl.setValue(this.selectedProduct.name);
    this.rent = this.selectedProduct.rent;
    this.productQuantity = this.selectedProduct.quantity_left;
    this.quantityFormControl.setValidators(Validators.max(this.productQuantity));
    if(this.quantity != null){
      this.amount = this.quantity * this.rent;
    }
  }

  PlaceOrder(){
    this.showSpinner = true;
    this.CheckIfExistingCustomer();
  }

  CheckIfExistingCustomer() : Customer{
    let customer: Customer;
    this.customerService.GetCustomerByMobile(this.customerMobile).subscribe((response) => {
      if(response.data != null && response.data.length > 0){
        customer = response.data.find(s => true);
        this.CreateOrder(customer);
      }
      else{
        this.AddNewCustomer();
      }
    });
    return customer;
  }

  AddNewCustomer(): Customer{
    let customer: Customer = {
      _id: 0,
      name: this.customerName,
      email: this.customerEmail,
      mobile: this.customerMobile,
      address: this.customerAddress
    }
    let newCustomer: Customer;
    this.customerService.AddCustomer(customer).subscribe((response) => {
      if(response.status == 200){
        this.customerService.GetCustomerByMobile(this.customerMobile).subscribe((customerResponse) => {
          if(customerResponse.status == 200){
            newCustomer = customerResponse.data.find(s => true);
            this.CreateOrder(newCustomer);
          }
        });
      }
    });
    return newCustomer;
  }

  CreateOrder(customer: Customer){
    if(customer != null && customer._id > 0 && this.selectedProduct != null && this.selectedProduct._id > 0){
      this.order = {
        _id: 0,
        customer_id: customer._id,
        item_id: this.selectedProduct._id,
        amount: this.days * this.quantity * this.rent,
        quantity: this.quantity,
        days: this.days,
        order_date: new Date(),
        returned: false,
        return_date: null
      }
      this.orderService.AddOrder(this.order).subscribe((response) => {
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

  ClearInputs(){
    this.quantity = 0;
    this.rent = 0;
  }

  OnQuantityChanged(){
    this.invalidQuantity = false;
    if(this.quantity > this.productQuantity){
      this.invalidQuantity = true;
    }
  }

  CalculateAmount(){
    if(this.quantity != null && this.rent != null && this.days != null){
      this.amount = this.quantity * this.rent * this.days;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
