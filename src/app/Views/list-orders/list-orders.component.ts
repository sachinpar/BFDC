import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Order } from 'src/Models/Order';
import { OrderService } from 'src/app/Services/order.service';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css']
})
export class ListOrdersComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  ordersList: Order[]= [];
  displayedColumns: string[] = ['_id', 'customer_id', 'product_id', 'quantity', 'days', 'amount', 'order_date', 'returned', 'return_date', 'editColumn'];
  dataSource: MatTableDataSource<Order>;

  showSpinner: boolean = true;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.GetOrders().subscribe((response) => {
      if(response.status == 200){
        this.showSpinner = false;
        this.ordersList = response.data;
        this.dataSource = new MatTableDataSource(this.ordersList);
        this.dataSource.sort = this.sort;
      }
    });
  }

}