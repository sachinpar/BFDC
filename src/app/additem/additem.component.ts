import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})
export class AdditemComponent implements OnInit {
  imageName: string;
  imageFile: File;
  showSpinner: boolean = false;
  constructor() { }

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
  }
}
