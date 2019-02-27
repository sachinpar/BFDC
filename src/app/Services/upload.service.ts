import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { IUploadResponse } from 'src/Models/ResponseModels/IUploadResponse';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'multipart/form-data'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  UploadFile(file: File){
    const formData: FormData = new FormData();
    formData.append('image', file);
    return this.http.post<IUploadResponse>('/api/uploads/upload', formData);
  }
}
