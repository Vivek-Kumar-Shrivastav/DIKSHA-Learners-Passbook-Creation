import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { UserDataService } from '../../service/user-data.service';
import { Credentials } from '../HelperInterfaces/Credendials';
import { Subject, Subjects } from '../HelperInterfaces/CertificateData';
import { ExtractUserDetailService } from 'src/app/service/extract-user-detail.service';
import { CertificateDataService } from 'src/app/service/certificate-data.service';

@Component({
  selector: 'app-dlp',
  templateUrl: './dlp.component.html',
  styleUrls: ['./dlp.component.css'],
})
export class DlpComponent implements OnInit, OnChanges, OnDestroy {
  // data : Observable<string> ;
  data: string = '';
  welcomeMessage: string = 'Hey Vivek';

  user: Credentials = {
    name: '',
    dob: '',
    fatherName: '',
    motherName: '',
    gender: '',
  };

  certificates: Subjects;
  coCurricularActivities: Subjects[];
  extraCurricularActivities: any = [];
  curricularActivities: any = [];

  constructor(
    private _dataService: UserDataService,
    private _extractUser: ExtractUserDetailService,
    private _certificateData : CertificateDataService
  ) {
    this.certificates = { subjects: [], certificateOf: '' };
    this.coCurricularActivities = [];
    this.extraCurricularActivities = [];
    this.curricularActivities = [];
  }

  async ngOnInit() { 
      await this.getDataFromLocalStorage();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    // this.data=  this._dataService.getData();
  }
  ngOnDestroy(): void {
    localStorage.clear();
  }

  downloadDlp() {
    const dlp = document.getElementById('download');
  }
  getUserData() {
    return (this.data = this._dataService.getData());
  }
  printData() {
    this._dataService.printData();
  }

  getDataFromLocalStorage(){
    for (let fileNum = 0; fileNum < localStorage.length; fileNum++) {
    // Use it to turn your xmlString into an XMLDocument
      let parser = new DOMParser();
      this.data = this._dataService.getData(`${fileNum}`);
      let xmlDoc = parser.parseFromString(this.data, 'text/xml');
    
      //User-Details  
      let certificateType = xmlDoc?.getElementsByTagName('Certificate')[0]?.getAttribute('type');
      if ( certificateType == 'SSCER')
        this.user = this._extractUser.getDetails(xmlDoc);

      // Certificate Details
      let newCertificates : Subjects = this._certificateData.getData(xmlDoc);
      console.log(`NewCertis : ${newCertificates}`);
      this.coCurricularActivities.push(newCertificates);
    }
  }
}
