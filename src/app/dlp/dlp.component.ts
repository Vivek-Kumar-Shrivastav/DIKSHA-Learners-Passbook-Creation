import { Component } from '@angular/core';

@Component({
  selector: 'app-dlp',
  templateUrl: './dlp.component.html',
  styleUrls: ['./dlp.component.css']
})
export class DlpComponent {

    name :string="Swati Pandey";
    age: string = "27";
    dateOfBirth : string ="31/07/1995";
    gender :string ="Female";
    aadhar :string ="XXXX XXXX 5864";

    certifications : any =[];
    extraCurricularActivities :any =[];
    curricularActivities :any =[];
}
