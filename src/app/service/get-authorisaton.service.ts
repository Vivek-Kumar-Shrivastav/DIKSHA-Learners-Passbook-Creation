import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorisatonService {

  constructor(private http: HttpClient) { }

  getAuthcode(url : string){
    return this.http.get<any>(url);
  }
}
