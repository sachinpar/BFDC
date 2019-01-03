import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IndexComponent } from './index/index.component';
import { AdditemComponent } from './additem/additem.component';
import { BookitemComponent } from './bookitem/bookitem.component';

const routes: Routes = [
  { path: "", component: IndexComponent, pathMatch: 'full' },
  { path: "home", 
    component: HomeComponent ,
    children: [
      { path: 'additem', component: AdditemComponent, outlet: "mainOutlet" },
      { path: 'bookitem', component: BookitemComponent, outlet: "mainOutlet" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [IndexComponent, HomeComponent, AdditemComponent, BookitemComponent];