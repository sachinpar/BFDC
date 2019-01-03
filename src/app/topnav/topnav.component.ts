import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  AddItem(){
    this.router.navigate(['additem']);
  }

  BookItem(){
    this.router.navigate([{ outlets: {mainOutlet: 'additem'}}]);
  }
}