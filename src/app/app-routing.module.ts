import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IndexComponent } from './index/index.component';
import { AdditemComponent } from './additem/additem.component';
import { BookitemComponent } from './bookitem/bookitem.component';
import { ListProductsComponent } from './Views/list-products/list-products.component'
import { ListOrdersComponent } from './Views/list-orders/list-orders.component';
import { AuthGuard } from './Security/auth.guard';

const routes: Routes = [
  { path: "", component: IndexComponent, pathMatch: 'full' },
  { path: "home", 
    component: HomeComponent ,
    children: [
      { path: 'additem', component: AdditemComponent, outlet: "mainOutlet" },
      { path: 'bookitem', component: BookitemComponent, outlet: "mainOutlet" },
      { path: 'listproducts', component: ListProductsComponent, outlet: "mainOutlet" },
      { path: 'listorders', component: ListOrdersComponent, outlet: "mainOutlet" }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [IndexComponent, HomeComponent, AdditemComponent, BookitemComponent, ListProductsComponent, ListOrdersComponent];