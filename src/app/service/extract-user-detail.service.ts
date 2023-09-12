import { Injectable } from '@angular/core';
import { Credentials } from '../../HelperInterfaces/Credendials';

@Injectable({
  providedIn: 'root',
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
  getDetails(xmlDoc: Document) {
    if (this.user.name == '') {
      let name = xmlDoc.getElementsByTagName('Person')[0]?.getAttribute('name');
      this.user.name = name == null ? '' : name;
    }

    if (this.user.fatherName == '') {
      let fatherName = xmlDoc
        .getElementsByTagName('Person')[0]
        ?.getAttribute('swd');
      this.user.fatherName = fatherName == null ? '' : fatherName;
    }
    if (this.user.motherName == '') {
      let motherName = xmlDoc
        .getElementsByTagName('Person')[0]
        ?.getAttribute('motherName');
      this.user.motherName = motherName == null ? '' : motherName;
    }

    if (this.user.gender == '') {
      let gender = xmlDoc
        .getElementsByTagName('Person')[0]
        ?.getAttribute('gender');
      this.user.gender = gender == null ? '' : gender;
    }

    // if(this.certificate.certificate == "HSCER"){}
    if (this.user.dob == '') {
      let dob = xmlDoc.getElementsByTagName('Person')[0]?.getAttribute('dob');
      this.user.dob = dob == null ? '' : dob;
    }

    return this.user;
  }
}
