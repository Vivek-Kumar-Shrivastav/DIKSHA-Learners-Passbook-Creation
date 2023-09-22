import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { UserDataService } from '../../service/user-data.service';
import { Credentials } from '../../../HelperInterfaces/Credendials';
import { Certificate } from '../../../HelperInterfaces/CertificateData';
import { DataBaseService } from '../../service/data-base.service';
import { DownloadAsPdfService } from 'src/app/service/download-as-pdf.service';
import { DlpService } from 'src/app/service/dlp.service';
import { File } from 'src/HelperInterfaces/Files';
@Component({
  selector: 'app-dlp',
  templateUrl: './dlp.component.html',
  styleUrls: ['./dlp.component.css'],
})
export class DlpComponent implements OnInit, OnDestroy {
  // data : Observable<string> ;
  private token: string = '';
  data: Array<string> = [];
  welcomeMessage: string = 'Hey Vivek';

  user: Credentials = {
    name: '',
    dob: '',
    fatherName: '',
    motherName: '',
    gender: '',
  };

  files : File[] = [];
  isLoaded = false;
  showTable: boolean = false;
  showSummary : boolean = false;
  showDocs : boolean = true;
  docsSelected = false;
  certificate: Certificate;
  coCurricularActivities: Certificate[];
  extraCurricularActivities: any = [];
  otherActivities: any = [];
  code = "";
  // private refreshed = false;

  constructor(
    private _dlpService : DlpService,
    private _userDataService: UserDataService,
    private _dataBaseService: DataBaseService,
    private _pdfService: DownloadAsPdfService
  ) {
    this.certificate = {
      certificateOf: '',
      uri: '',
      subjects: [],
      rollNumber: '',
    };
    this.coCurricularActivities = [];
    // this.extraCurricularActivities = [];
    // this.otherActivities = [];
  }
  async ngOnInit() {
    const url = window.location.href;
    const param = new URLSearchParams(url?.split('?')[1]);

    //Extracting-Auth-Code
    this.code = param.get('code') !== null ? param.get('code')! : '';
    if (this.code !== '' ) {    // code is there in paramaters of URL O
      // console.log('Got the code in dlp', this.code);

      this.token = await this._dlpService.getToken(this.code);
      // console.log('Got the token in dlp', this.token);
    
      if(this.token !== ""){                 // If token received 
        this._dlpService.getDetails(this.token);
        this.files =  await this._dlpService.getFiles(this.token);
      }
    }
    else{
      // Now data is stored in storage and now onwards it will be fetched form there
      this.isLoaded= true;
    }
   }

  ngOnDestroy(): void {}

  async showData(indices : number[]){

    this.coCurricularActivities = [];    // Reset the array of co-curricular activities
    await this._dataBaseService.getDataFromLocalStorage( this.user, this.coCurricularActivities,indices);
    this.docsSelected= true;
    console.log(`From DLP USER : ${this.user.name}`)
  }
 
  onClick(event : string) {
    this.showTable = false;
    this.showSummary  = false;
    this.showDocs  = false;

    if(event == 'docs'){
        this.showDocs = true;
    }
    if(event == 'table'){
        this.showTable = true;
    }
    if(event == 'summary'){
        this.showSummary = true;
       
    }
  }

  printData() {
    this._userDataService.printData();
  }

  generatePDF(){
    console.log("Download PDF");
    this._pdfService.generatePDF();
  }
}
