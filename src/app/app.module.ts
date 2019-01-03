import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { IndexComponent } from './index/index.component';
import { UserService } from './user.service';

import { MatInputModule, MatCardModule, MatButtonModule, MatSnackBarModule, MatProgressSpinnerModule, MatMenuModule } from '@angular/material';
import { HomeComponent } from './home/home.component';
import { TopnavComponent } from './topnav/topnav.component';
import { AdditemComponent } from './additem/additem.component';
import { BookitemComponent } from './bookitem/bookitem.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    HomeComponent,
    routingComponents,
    TopnavComponent,
    AdditemComponent,
    BookitemComponent
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
    FormsModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
