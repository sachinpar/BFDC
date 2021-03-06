import { Component, OnInit } from '@angular/core';
import { Product } from 'src/Models/Product';
import { ProductService } from '../Services/product.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadService } from '../Services/upload.service';
import { Size } from 'src/Models/Size';
import { FormControl, Validators } from '@angular/forms';
import { SizeService } from '../Services/size.service';
import { ProductsListNavService } from '../NavigationServices/products-list-nav.service';

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
  quantity: FormControl = new FormControl('', [Validators.required]);
  size: FormControl = new FormControl('', [Validators.required]);
  color: string;
  price: number;
  rent: number;
  showSpinner: boolean = false;
  sizes: Size[] = [];
  noSizes: boolean = false;
  editedProduct: Product;
  editMode: boolean = false;

  constructor(private productService: ProductService, private uploadService: UploadService, public snackBar: MatSnackBar, public router: Router, private productNavService: ProductsListNavService, private route: ActivatedRoute) {
   }

  ngOnInit() {
    this.imageName = "No file selected";
    let prodId = this.route.snapshot.queryParamMap.get("id");
    if(prodId != null){
      this.productNavService.productNav$.subscribe(product => {
        this.editMode = true;
        this.editedProduct = product;
        this.name = product.name;
        this.color = product.color;
        this.price = product.price;
        this.rent = product.rent;
        this.imageName = product.image_name;
        this.sizes = product.sizes;
      });
    }
  }

  FileSelected(event){
    this.imageFile = <File>event.target.files[0];
    this.imageName = this.imageFile.name;
  }

  AddProduct(){
    if(this.sizes == null || this.sizes.length <= 0){
      this.noSizes = true;
      return;
    }
    this.showSpinner = true;
    this.product = {
      _id: 0,
      name: this.name,
      color: this.color,
      price: this.price,
      rent: this.rent,
      image_name: this.imageName,
      quantity_left: this.quantity.value,
      sizes: this.sizes
    };
    this.uploadService.UploadFile(this.imageFile).subscribe((uploadResponse) => {
      if(uploadResponse.image_url != null){
        this.product.image_url = uploadResponse.image_url;
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
    });
  }

  UpdateProduct(){
    if(this.sizes == null || this.sizes.length <= 0){
      this.noSizes = true;
      return;
    }
    this.showSpinner = true;
    this.product = {
      _id: 0,
      name: this.name,
      color: this.color,
      price: this.price,
      rent: this.rent,
      image_name: this.imageName,
      image_url: this.editedProduct.image_url,
      quantity_left: this.quantity.value,
      sizes: this.sizes
    };
    this.productService.DeleteProduct(this.editedProduct._id).subscribe(res => {
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
    });
  }

  AddSize(){
    if(!this.size.hasError('required') && !this.quantity.hasError('required')){
      let existingSize: Size = this.sizes.find(s => s.size == this.size.value);
      if (existingSize != null){
        existingSize.quantity += this.quantity.value;
      }
      else{
        let tempSize: Size = {
          _id: 0,
          size: this.size.value,
          quantity: this.quantity.value,
          quantity_left: this.quantity.value
        }
        this.sizes.push(tempSize);
      }
      this.size.reset();
      this.quantity.reset();
    }
  }

  DeleteSize(event){
    let imgId: string = event.target.id;
    let sizeIndex = Number.parseInt(imgId.substr(4, imgId.length - 4));
    this.sizes.splice(sizeIndex, 1);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
