import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsListNavService } from 'src/app/NavigationServices/products-list-nav.service';
import { Product } from 'src/Models/Product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: Product = null;

  constructor(private route: ActivatedRoute, private productNavService: ProductsListNavService) { }

  ngOnInit() {
    this.productNavService.productNav$.subscribe(product => {
      this.product = product;
    });
  }

}
