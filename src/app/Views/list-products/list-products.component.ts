import { Component, OnInit } from '@angular/core';
import { Product } from 'src/Models/Product';
import { ProductService } from 'src/app/Services/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {

  productsList: Product[]= [];
  displayedColumns: string[] = ['id', 'name', 'size', 'color', 'price', 'rent', 'quantity', 'quantity_left'];

  showSpinner: boolean = true;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.GetProducts().subscribe((response) => {
      if(response.status == 200){
        this.showSpinner = false;
        this.productsList = response.data;
      }
    });
  }

}
