import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { IndexComponent } from './index/index.component';
import { UserService } from './user.service';
import { ProductService } from './Services/product.service';

import { MatInputModule, MatCardModule, MatButtonModule, MatSnackBarModule, MatProgressSpinnerModule, MatMenuModule, MatAutocompleteModule, MatSlideToggleModule, MatBadgeModule, MatTableModule } from '@angular/material';
import { HomeComponent } from './home/home.component';
import { TopnavComponent } from './topnav/topnav.component';
import { AdditemComponent } from './additem/additem.component';
import { BookitemComponent } from './bookitem/bookitem.component';
import { ListProductsComponent } from './Views/list-products/list-products.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    HomeComponent,
    routingComponents,
    TopnavComponent,
    AdditemComponent,
    BookitemComponent,
    ListProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatBadgeModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [UserService, ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
