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
  
  getData(key = "usrData") {
    return localStorage.getItem(`${key}`) == null ? "No data is stored corresponding to this key" : localStorage.getItem(`${key}`)!;
  }

  updateData(index: number, data: string){
    localStorage.setItem(`${index}`, data);
    this.data$ = localStorage.getItem(`${index}`)!;
  }

  printData(){
      console.log(localStorage.getItem("usrData")!);
  }
 
}
