import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/Models/Product';
import { ProductService } from 'src/app/Services/product.service';
import { Observable } from 'rxjs';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  productsList: Product[]= [];
  displayedColumns: string[] = ['id', 'name', 'size', 'color', 'price', 'rent', 'quantity', 'quantity_left'];
  dataSource: MatTableDataSource<Product>;

  showSpinner: boolean = true;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.GetProducts().subscribe((response) => {
      if(response.status == 200){
        this.showSpinner = false;
        this.productsList = response.data;
        this.dataSource = new MatTableDataSource(this.productsList);
        this.dataSource.sort = this.sort;
      }
    });
  }

}
