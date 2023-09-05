import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  // private dataSubject  =  new ReplaySubject<string>(1);
  // public data$ = this.dataSubject.asObservable();
     private data$ = '';
     

  // public testData = new ReplaySubject<string>(1);
  constructor() { 
    // this.dataSubject.next("Initial Data");
    // this.testData.next("Data-0");
  }
  
  getData(key :number = 0) {
    return localStorage.getItem(`${key}`) == null ?`{"no-data": "No data is stored corresponding to this key"}` :localStorage.getItem(`${key}`)!;
  }

  updateData(index: number, data: string){
    localStorage.setItem(`${index}`, data);
    this.data$ = data;
  }

  printData(key = "usrData"){
      console.log(localStorage.getItem(`${key}`)!);
  }
 
}
