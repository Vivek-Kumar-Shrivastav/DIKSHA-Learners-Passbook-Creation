import { getDebugNode, Injectable, resolveForwardRef } from '@angular/core';
import { Credentials } from '../../HelperInterfaces/Credendials';

@Injectable({
  providedIn: 'root',
})
export class IdentitySetService {
  private user: Credentials;
  constructor() {
    this.user = {
      name: '',
      dob: '',
      fatherName: '',
      motherName: '',
      gender: '',
    };
  }
  extractDetails(xmlDoc: Document, user : Credentials) {
    if (user.name == '') {
      let name = xmlDoc.getElementsByTagName('Person')[0]?.getAttribute('name');
      user.name = name == null ? '' : name;
    }

    // if(this.certificate.certificate == "HSCER"){}
    if (user.dob == '') {
      let dob = xmlDoc.getElementsByTagName('Person')[0]?.getAttribute('dob');
      user.dob = dob == null ? '' : dob;
    }
    if (user.fatherName == '') {
      let fatherName = xmlDoc
        .getElementsByTagName('Person')[0]
        ?.getAttribute('swd');
      user.fatherName = fatherName == null ? '' : fatherName;
    }
    if (user.motherName == '') {
      let motherName = xmlDoc
        .getElementsByTagName('Person')[0]
        ?.getAttribute('motherName');
      user.motherName = motherName == null ? '' : motherName;
    }
    if (user.gender == '') {
      let gender = xmlDoc
        .getElementsByTagName('Person')[0]
        ?.getAttribute('gender');
      user.gender = gender == null ? '' : gender;
      gender = user.gender;
      
      if(gender != '' &&  gender.toLowerCase()[0] == 'm')
          user.gender = 'Male';
      else if(gender != '' &&  gender.toLowerCase()[0] == 'f')
          user.gender = 'Female';
      else {
          user.gender = 'Unknown';
      }
     
    }

    this.user = user;
    return user;
  }
  setDetails(user : Credentials){
      let {name, dob, fatherName, motherName, gender} = user;
      if(name != ''){
        this.user.name = name;
      }
      if(dob != ''){
        this.user.dob = dob;
      }
      if(fatherName != ''){
        this.user.fatherName = fatherName;
      }
      if(motherName != ''){
        this.user.motherName = motherName;
      }
      if(gender != ''){
        this.user.gender = gender;
      }
      return this.user;
  }
  
  getDetails() : Promise<Credentials>{
  return new Promise((resolve) =>{
       if(this.user.name !== ''){
        resolve(this.user);
       }
  })
  }
}
