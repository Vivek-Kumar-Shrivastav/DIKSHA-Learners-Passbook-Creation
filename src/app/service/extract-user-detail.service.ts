import { Injectable } from '@angular/core';
import { Credentials } from '../home/HelperInterfaces/Credendials';

@Injectable({
  providedIn: 'root'
})
export class ExtractUserDetailService {
  user: Credentials;
  constructor() {
    this.user = {
      name: '',
      dob: '',
      fatherName: '',
      motherName: '',
      gender: '',
    };
   }
  getDetails(xmlDoc : Document){
    this.user.name = xmlDoc
    .getElementsByTagName('Person')[0]
    .getAttribute('name')!;
  this.user.fatherName = xmlDoc
    .getElementsByTagName('Person')[0]
    .getAttribute('swd')!;
  this.user.motherName = xmlDoc
    .getElementsByTagName('Person')[0]
    .getAttribute('motherName')!;
  this.user.gender = xmlDoc
  .getElementsByTagName('Person')[0]
  .getAttribute('gender')!;
 // this.certificate.certificate  = xmlDoc.getElementsByTagName('Certificate')[0].getAttribute("type")!;
// if(this.certificate.certificate == "HSCER"){}

  this.user.dob =
  xmlDoc.getElementsByTagName('Person')[0].getAttribute('dob') == undefined
    ? ''
    : xmlDoc.getElementsByTagName('Person')[0].getAttribute('dob')!;
  
    return this.user;
  }

}
