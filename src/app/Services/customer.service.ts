import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { ICustomerResponse } from 'src/Models/ICustomerResponse';
import { Customer } from 'src/Models/Customer'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  GetCustomers(){
    return this.http.get<ICustomerResponse>('/api/customers', httpOptions);
  }

  GetCustomer(id: number){
    return this.http.get<ICustomerResponse>('/api/customers/' + id, httpOptions);
  }

  GetCustomerByMobile(mobile: string){
    return this.http.get<ICustomerResponse>('/api/customers/getbymobile/' + mobile, httpOptions);
  }

  AddCustomer(customer: Customer){
    const body = {"customer": customer};
    return this.http.post<ICustomerResponse>('/api/customers/add', body, httpOptions);
  }

  DeleteCustomer(id: number){
    return this.http.delete<ICustomerResponse>('/api/customers/delete/' + id, httpOptions);
  }

  UpdateCustomer(customer: Customer){
    const body = JSON.stringify(customer);
    return this.http.post<ICustomerResponse>('/api/customers/update', body, httpOptions);
  }
}
