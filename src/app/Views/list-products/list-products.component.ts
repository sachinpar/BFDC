import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/Models/Product';
import { ProductService } from 'src/app/Services/product.service';
import { MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { Size } from 'src/Models/Size';
import { SizeService } from 'src/app/Services/size.service';
import { CartService } from 'src/app/Services/cart.service';
import { CartProduct } from 'src/Models/CartProduct';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  productsList: Product[]= [];
  pagedList: Product[]= [];
  sizeList: Size[];
  displayedColumns: string[] = ['id', 'name', 'size', 'color', 'price', 'rent', 'quantity', 'quantity_left'];
  dataSource: MatTableDataSource<Product>;
  breakpoint: number = 4;
  // MatPaginator Inputs
  length: number = 0;
  pageSize: number = 4;
  pageSizeOptions: number[] = [4, 8, 12];
  cartProducts: CartProduct[] = [];
  tempProducts: CartProduct[] = [];

  showSpinner: boolean = true;
  searchText: string = "";
  selectedQuantity: number = 5;
  gridHeight: number = 85;

  constructor(private productService: ProductService, private sizeService: SizeService, private cartService: CartService, private router: Router) { }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 800) ? 1 : 4;
    this.productService.GetProducts().subscribe((response) => {
      if(response.status == 200){
        this.productsList = response.data;
        this.dataSource = new MatTableDataSource(this.productsList);
        this.dataSource.sort = this.sort;
        this.GetSizes();
      }
      this.pagedList = this.productsList.slice(0, 4);
      this.length = this.productsList.length;
    });

    let tempProduct: CartProduct = {
      product_id: 2,
      size_id: 20,
      quantity: 10
    };
  }

  GetSizes(){
    this.sizeService.GetSizes().subscribe((response) => {
      if(response.status == 200){
        this.showSpinner = false;
        this.sizeList = response.data;
        this.productsList.forEach(prod => {
          prod.sizes = this.sizeList.filter(s => s.product_id == prod._id)
        });
      }
    });
  }

  OnPageChange(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.length){
      endIndex = this.length;
    }
    this.pagedList = this.productsList.slice(startIndex, endIndex);
    this.gridHeight = (event.pageSize/4) * 85;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 800) ? 1 : 4;
  }

  OnSearchTextChange(){
    let text = this.searchText.trim().toLowerCase();
    if(text != ""){
      this.pagedList = this.productsList.filter(s => s.name.toLowerCase().includes(text) || s.color.toLowerCase().includes(text)).slice(0, this.pageSize);
      this.length = this.pagedList.length;
    }
    else{
      this.length = this.productsList.length;
      this.pagedList = this.productsList.slice(0, this.pageSize);
    }
  }

  AddToSelectedList(product_id, size, quantity){
    //remove if this size is already selected
    if(this.tempProducts.find(s => s.product_id == product_id && s.size == size) != null){
      this.tempProducts.splice(this.tempProducts.findIndex(s => s.product_id == product_id && s.size == size), 1);
      this.UpdateSizeButton(product_id, size, "white", "rgba(0,0,0,.87)");
      this.UpdateGridHeight(-5);
      return;
    }

    //Change background of selected size
    this.UpdateSizeButton(product_id, size, "rgb(54, 59, 216)", "white");
    
    //Increase the height of the grid as we select more sizes
    this.UpdateGridHeight(5);

    let sizeObj = this.sizeList.find(s => s.product_id == product_id && s.size == size);
    let prodObj = this.productsList.find(s => s._id == product_id);
    if(sizeObj != null){
      let tempProduct: CartProduct = {
        product_id: product_id,
        size_id: sizeObj._id,
        size: size,
        product_name: prodObj.name,
        image_url: prodObj.image_url,
        quantity: quantity
      };
      this.tempProducts.push(tempProduct);
    }
  }

  UpdateSizeButton(product_id, size, bgColor, fontColor){
    let id = "sizeDiv_" + product_id + "_" + size;
    let element = document.getElementById(id);
    element.style.backgroundColor = bgColor;
    element.style.color = fontColor;
  }

  UpdateGridHeight(percent){
    let gridContainer = document.getElementById("matGridContainer");
    let gridContainerHeight = Number(gridContainer.style.height.replace("%",""));
    gridContainer.style.height = (gridContainerHeight + percent).toString() + "%";
  }

  AddToCart(){
    Array.prototype.push.apply(this.cartProducts, this.tempProducts.slice(this.cartProducts.length, this.tempProducts.length));
    this.cartService.UpdateCart(this.cartProducts);
  }

  DeleteProduct(product_id){
    let index = this.productsList.findIndex(s => s._id == product_id);
    this.productService.DeleteProduct(product_id).subscribe((response) => {
      if(response.status == 200){
        this.productsList.splice(index, 1);
        this.OnSearchTextChange();
      }
    });
  }

  EditProduct(product_id){
    this.router.navigate(['/home/additem'], { queryParams: { product_id: product_id } });
  }

  GetSelectedSizeListForProduct(product_id){
    return this.tempProducts.filter(s => s.product_id == product_id);
  }

  GetSizeValueById(size_id){
    return this.sizeList.find(s => s._id == size_id).size;
  }

  UpdateQtyInSelectedList(product_id, size_id){
    // let val = document.getElementById("quantity_" + product_id + "_" + size_id).
  }

}