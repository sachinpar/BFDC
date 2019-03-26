import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatSort, MatTableDataSource } from '@angular/material';
import { Order } from 'src/Models/Order';
import { OrderService } from 'src/app/Services/order.service';
import { OrderItem } from 'src/Models/OrderItem';
import { ProductService } from 'src/app/Services/product.service';
import { Product } from 'src/Models/Product';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css']
})
export class ListOrdersComponent implements OnInit {

  // @ViewChild(MatSort) sort: MatSort;

  ordersList: Order[]= [];
  ordersItemsList: OrderItem[] = [];
  productsList: Product[] = [];
  // displayedColumns: string[] = ['_id', 'customer_id', 'product_id', 'quantity', 'days', 'amount', 'order_date', 'returned', 'return_date', 'editColumn'];
  // dataSource: MatTableDataSource<Order>;

  showSpinner: boolean = true;

  constructor(private orderService: OrderService, private productService: ProductService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.orderService.GetOrders().subscribe((response) => {
      if(response.status == 200){
        this.ordersList = response.data;
        // this.dataSource = new MatTableDataSource(this.ordersList);
        // this.dataSource.sort = this.sort;
        this.orderService.GetOrderItems().subscribe((response) => {
          if(response.status == 200){
            this.showSpinner = false;
            this.ordersItemsList = response.data;
          }
          else{
            this.openSnackBar("Error while loading order items. Please contact Sachin Parashar @9908766262 or 8331920613", "Close");
          }
        });
      }
      else{
        this.openSnackBar("Error while loading orders. Please contact Sachin Parashar @9908766262 or 8331920613", "Close");
      }
    });
    this.productService.GetProducts().subscribe((response) => {
      if(response.status == 200){
        this.productsList = response.data;
      }
      else{
        this.openSnackBar("Error while loading products. Please contact Sachin Parashar @9908766262 or 8331920613", "Close");
      }
    });
  }

  GetOrderItems(order_id: number){
    return this.ordersItemsList.filter(s => s.order_id == order_id);
  }

  GetImageUrl(product_id: number){
    return this.productsList.find(s => s._id == product_id).image_url;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}