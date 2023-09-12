import { Injectable } from '@angular/core';
import { CertificateDataService } from './certificate-data.service';
import { ExtractUserDetailService } from './extract-user-detail.service';
import { UserDataService } from './user-data.service';
import { Certificate } from 'src/HelperInterfaces/CertificateData';
import { Credentials } from 'src/HelperInterfaces/Credendials';
@Injectable({
  providedIn: 'root'
})
export class DataBaseService {

  constructor(
    private _userDataService: UserDataService,
    private _extractUserDetail: ExtractUserDetailService,
    private _certificateData: CertificateDataService,
    ) { }

  async getDataFromLocalStorage(user : Credentials, coCurricularActivities : Certificate[]) {
    for (let fileNum = 0; fileNum < localStorage.length; fileNum++) {
      let file;
      try {
        file = await JSON.parse(this._userDataService.getData(fileNum));

        if ('no-data' in file) {
          continue;
        }

        let parser = new DOMParser();
        let xml = parser.parseFromString(file.xml, 'text/xml');

        //User-Details
        let certificateType = xml
          ?.getElementsByTagName('Certificate')[0]
          ?.getAttribute('type');

        console.log('CertificateType :', certificateType);
        // Skip this certificate, since it is not an Academic Record
        if (certificateType == null || certificateType == undefined) {
             continue;
          }

        // if (certificateType == 'SSCER') {
          user = this._extractUserDetail.getDetails(xml);
          console.log(user);
        // }

        // Certificate Details
        let newCertificates: Certificate = this._certificateData.getData({
          uri: file.uri,
          xml: xml,
        });
        console.log(`NewCertis : ${newCertificates}`);

        //Add uri to later extract pdf
        coCurricularActivities.push(newCertificates);
      } catch (err) {
        console.log('Error in getting dat from localStorage', err);
        continue;
      }
    }
  }
}


/*
this.user, this.coCurricularActivities */