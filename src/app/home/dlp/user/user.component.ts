import { Component, Input, ModuleWithComponentFactories } from '@angular/core';
import { UserDataService } from 'src/app/service/user-data.service';
import { Credentials } from 'src/HelperInterfaces/Credendials';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  @Input() user = { name : '', dob : '', fatherName : '', motherName : '', gender : ''} ;

  name : string = this.user.name;
  dob : string = this.user.dob;
  fatherName : string = this.user.fatherName;
  motherName : string = this.user.motherName;
  gender : string = this.user.gender;
  imageUrl : string = this._userDataService.imageUrl; 
  
  constructor(private _userDataService : UserDataService){}
  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this._userDataService.imageUrl = this.imageUrl;
      };
      reader.readAsDataURL(file);
    }
  }

  isEditing  = {
    name : false,
    dob : false,
    fatherName : false,
    motherName : false,
    gender : false,
  }

  makeEditable(key : string) {
    this.isEditing[key] = true;
  }

  disableEditing(key : string) {
    this.isEditing[key] = false;
  }
  
}
