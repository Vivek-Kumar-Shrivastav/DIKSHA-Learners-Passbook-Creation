import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { UserDataService } from '../../service/user-data.service';
import { Credentials } from '../../../HelperInterfaces/Credendials';
import { Certificate } from '../../../HelperInterfaces/CertificateData';
import { DataBaseService } from '../../service/data-base.service';
import { DownloadAsPdfService } from 'src/app/service/download-as-pdf.service';

@Component({
  selector: 'app-dlp',
  templateUrl: './dlp.component.html',
  styleUrls: ['./dlp.component.css'],
})
export class DlpComponent implements OnInit, OnDestroy {
  // data : Observable<string> ;
  data: Array<string> = [];
  welcomeMessage: string = 'Hey Vivek';

  user: Credentials = {
    name: '',
    dob: '',
    fatherName: '',
    motherName: '',
    gender: '',
  };
  showTable: boolean = false;
  showSummary : boolean = false;
  showDocs : boolean = true;
  docsSelected = false;
  certificate: Certificate;
  coCurricularActivities: Certificate[];
  extraCurricularActivities: any = [];
  otherActivities: any = [];

  constructor(
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
    this.extraCurricularActivities = [];
    this.otherActivities = [];
  }
  async ngOnInit() { }
 
  ngOnDestroy(): void {
    localStorage.clear();
  }
  
  async showData(indices : number[]){

    this.coCurricularActivities = [];    // Reset the array of co-curricular activities
    await this._dataBaseService.getDataFromLocalStorage(
      this.user,
      this.coCurricularActivities,
      indices
    );
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
