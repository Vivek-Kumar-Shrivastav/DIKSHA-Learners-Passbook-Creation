import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetAuthorisatonService {

  constructor(private http: HttpClient) { }

  getAuthcode(url : string){
    return this.http.get<any>(url);
  }
}
