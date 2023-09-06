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
  data: Array<string> = [];
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
  docsImg: Array<string> = [];

  constructor(
    private _userDataService: UserDataService,
    private _extractUserDetail: ExtractUserDetailService,
    private _certificateData: CertificateDataService
  ) {
    this.certificates = { certificateOf: '', uri: '', subjects: [], rollNumber : '' };
    this.coCurricularActivities = [];
    this.extraCurricularActivities = [];
    this.curricularActivities = [];
  }

  async ngOnInit() {
    await this.getDataFromLocalStorage();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    // this.data=  this._userDataService.getData();
  }
  ngOnDestroy(): void {
    alert(localStorage.getItem('0'));
    localStorage.clear();
  }

  downloadDlp() {
    const dlp = document.getElementById('download');
  }
  // getUserData() {
  //   return (this.data = this._userDataService.getData());
  // }

  printData() {
    this._userDataService.printData();
  }

  async getDataFromLocalStorage() {
    for (let fileNum = 0; fileNum < localStorage.length; fileNum++) {
      // Use it to turn your xmlString into an XMLDocument
      // File[index] will have two things pdf : ".blob" and xml : ".xml";
      //  console.log(`File ${fileNum}: ${this.data}`);
      
      let file;
      try {
        file = await JSON.parse(this._userDataService.getData(fileNum));
        
         if("no-data" in file) {
          continue;
         }
        // let pdf = this.data[0];
        // window.open(pdf, '_blank');
        let parser = new DOMParser();
        let xml = parser.parseFromString(file.xml, 'text/xml'); // will not give an error

        //User-Details
        let certificateType = xml?.getElementsByTagName('Certificate')[0]?.getAttribute('type');

        console.log("CertificateType :",certificateType);
        if(certificateType == null || certificateType == undefined){
          continue;
          //skip this certificate, since it is not an Academic Record
          // You can ask the user if he/she wamnts to share the aadhar card or not and then make the required changes hare.
        }
        if (certificateType == 'SSCER') {
          this.user = this._extractUserDetail.getDetails(xml);
          console.log(this.user);
        }
        // Certificate Details
        let newCertificates: Subjects = this._certificateData.getData({
          uri: file.uri,
          xml: xml,
        });
        console.log(`NewCertis : ${newCertificates}`);

        //Add uri to later extract pdf
        this.coCurricularActivities.push(newCertificates);
      } catch (err) {
        console.log('Error in getting dat from localStorage', err);
        continue;
      }
    }
  }
}
