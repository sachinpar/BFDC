import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Item } from 'src/Models/Item';
import {map, startWith} from 'rxjs/operators';
import { ItemService } from '../Services/item.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookitem',
  templateUrl: './bookitem.component.html',
  styleUrls: ['./bookitem.component.css']
})
export class BookitemComponent implements OnInit{

  stateCtrl = new FormControl();
  filteredProducts: Observable<Item[]>;
  products: Item[] =[];

  constructor(public itemService: ItemService, public router: Router) {

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
    const filterValue = value.toLowerCase();
    return this.products.filter(product => product.name.toLowerCase().includes(filterValue) || product.color.toLowerCase().includes(filterValue));
  }

  OnProductSelected(event){
    console.log(event);
  }

}
