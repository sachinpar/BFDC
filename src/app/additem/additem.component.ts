import { Component, OnInit } from '@angular/core';
import { Product } from 'src/Models/Product';
import { ProductService } from '../Services/product.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})
export class AdditemComponent implements OnInit {
  imageName: string;
  imageFile: File;
  product: Product;
  name: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  rent: number;
  showSpinner: boolean = false;

  constructor(private productService: ProductService, public snackBar: MatSnackBar, public router: Router) { }

  ngOnInit() {
    this.imageName = "No file selected";
  }

  FileSelected(event){
    this.imageFile = <File>event.target.files[0];
    this.imageName = this.imageFile.name;
    console.log(this.imageFile);
  }

  AddProduct(){
    this.showSpinner = true;
    this.product = {
      _id: 0,
      name: this.name,
      quantity: this.quantity,
      size: this.size,
      color: this.color,
      price: this.price,
      rent: this.rent,
      image_name: this.imageName,
      quantity_left: this.quantity
    };
    this.productService.AddProduct(this.product).subscribe((response) => {
      this.showSpinner = false;
      if(response.status == 200)
      {
        this.openSnackBar("Product added", "Close");
        this.router.navigateByUrl('home');
      }
      else
      {
        this.openSnackBar(response.message, "Close");
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
