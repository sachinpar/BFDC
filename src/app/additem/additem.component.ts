import { Component, OnInit } from '@angular/core';
import { Item } from 'src/Models/Item';
import { ItemService } from '../Services/item.service';
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
  item: Item;
  showSpinner: boolean = false;

  constructor(private itemService: ItemService, public snackBar: MatSnackBar, public router: Router) { }

  ngOnInit() {
    this.imageName = "No file selected";
  }

  FileSelected(event){
    this.imageFile = <File>event.target.files[0];
    this.imageName = this.imageFile.name;
    console.log(this.imageFile);
  }

  AddItem(){
    this.showSpinner = true;
    this.itemService.AddItem(this.item).subscribe((response) => {
      this.showSpinner = false;
      if(response.status == 200)
      {
        this.openSnackBar("Item added", "Close");
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
