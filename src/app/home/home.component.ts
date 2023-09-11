import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { combineLatest, Observable, lastValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GetAuthorisatonService } from '../service/get-authorisaton.service';
import { UserDataService } from '../service/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  // baseURL: string = "https://api.github.com/";
  studentData: any = [];
  base64Response: any;
  code: string = '';
  token: string = '';
  files: any = [];

  constructor(
    private _authorize: GetAuthorisatonService,
    private http: HttpClient,
    private _userDataService: UserDataService
  ) {}

  getAuthCode() {
    const url = 'http://localhost:5000/api/authorise';
    this._authorize.getAuthcode(url).subscribe(async (response) => {
      console.log(response);
      const tab = window.open(response.url);
      const interval = setInterval(async () => {
        if (tab?.closed) {
          // window.alert("Windows closed");
          clearInterval(interval);
        } else {
          const url = tab?.location.href;

          const param = new URLSearchParams(url?.split('?')[1]);

          //Auth-Code
          this.code = param.get('code') !== null ? param.get('code')! : '';

          console.log('inside else : tab is open');
          if (this.code !== '') {
            console.log('inside if : got the code');
            console.log(this.code);

            //Temp
            localStorage.setItem('code', this.code);

            clearInterval(interval);
            let body = { code: this.code };
            console.log(`Body : ${body}`);

            this.getToken();

            console.log(`Going to fetch the details and Token = ${this.token}`);
          }
        }
      }, 1000);
    });
  }

  // Helper functions

  processFileResponse(
    pdf: any,
    fileName: string,
    render: string
  ): Promise<Blob> {
    let blob: Blob;
    return new Promise<Blob>((resolve, reject) => {
      if (render === 'base64') {
        // const base64Response = pdf;
        const binaryString = window.atob(pdf);
        const bytes = new Uint8Array(binaryString.length);
        const binaryToBlob = bytes.map((byte, i) => binaryString.charCodeAt(i));
        blob = new Blob([binaryToBlob], { type: 'application/pdf' });
      } else {
        blob = new Blob([pdf], { type: 'application/pdf' });
      }
      resolve(blob);
    });
  }
  downloadFile(blob: any, fileName: string) {
    // Other Browsers
    const url = (window.URL || window.webkitURL).createObjectURL(blob);
    window.open(url, '_blank');
    console.log('Downloading PDF...');
    // rewoke URL after 15 minutes    OR  Additionally, use can add the user(Accessor_) with grant he/she will always be able to access the docs
    // setTimeout(() => {
    //   window.URL.revokeObjectURL(url);
    // }, 30 * 60 * 1000);
  }

  async getToken(flag = 'details'): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      console.log('Inside getToken');

      const tokenURL = 'http://localhost:5000/api/token';
      let body = { code: this.code };
      console.log(`Body-Code : ${body.code}`);
      let accessToken = '';

      this.http.post<any>(tokenURL, body).subscribe({
        next: (response) => {
          accessToken = response.access_token;
          // console.log(`Response : ${response.access_token}`);
          console.log(`getToken() = ${accessToken}`);
          this.token = accessToken;
          // console.log(`Token Fetched : ${this.token}`);
          if (flag === 'details') {
            this.getDetails(accessToken);
            console.log('Details fetched !!!');
            this.getFiles(accessToken);
            resolve(accessToken);
          } else if (flag == 'token') {
            // resolve()
          }
        },
        error: (err) => {
          accessToken = 'No Token';
          console.log('API Error: ', err);
          resolve('no-access');
        },
      });
      // return accessToken;
    });
    //Testing
    // console.log(`Returning accesToken : ${accessToken}`);
    // return accessToken;
  }
  async getDetails(receivedToken) {
    console.log('Inside getDetails');
    // let body = { code: this.code };
    const details = 'http://localhost:5000/api/details';
    // const body = {'token': response.access_token};
    try {
      await this.http
        .get<any>(details, {
          params: {
            token: receivedToken,
          },
        })
        .subscribe((det) => {
          console.log(`Details : ${det}`);
          return det;
        });
      console.log(`Details Fetched`);
    } catch (err) {
      console.log(`Error in details : ${err}`);
    }
  }
  async getFiles(token): Promise<any> {
    console.log('Inside getFiles');
    const filesURL = 'http://localhost:5000/api/files';
    // const params = new HttpParams().set('token', token);
    const body = { token: token };
    let fileCollection: any = [];
    await this.http.post<any>(filesURL, body).subscribe({
      next: async (files) => {
        console.log(`Subscribe Length itni hai : ${files.items.length}`);
        this.files = files.items;
        await this.storeFile();
      },
      error: (err) => {
        console.error(`Files not loaded!!!`);
      },
    });
  }
  async storeFile() {
    console.log('Inside storeFile');
    const urlXml = 'http://localhost:5000/api/file';
    for (let fileNum = 2; fileNum < this.files.length; fileNum++) {
      let body = {
        token: this.token,
        uri: this.files[fileNum].uri,
      };
      console.log(`Token : ${this.token}`);
      console.log(`URI-${fileNum}: ${this.files[fileNum].uri}`);
      console.time(`${fileNum}`);

      this.http
        .post<any>(urlXml, body, { responseType: 'json' })
        .subscribe(async (res) => {
          let xmlFile: string = res.xml; // xml-File

          var parser = new DOMParser();
          var xml = parser.parseFromString(xmlFile, 'text/xml');

          let data = JSON.stringify({ uri: body.uri, xml: xmlFile }); // [uri, xml]

          this._userDataService.updateData(fileNum, data);
          this.studentData.push(this._userDataService.getData(fileNum));
          // console.log(this._userDataService.getData(fileNum));

          let isNoXml =
            xml.getElementsByTagName('NoXml')[0]?.childNodes[0]?.nodeValue;
          console.log(
            `NoXml : ${
              xml.getElementsByTagName('NoXml')[0]?.childNodes[0]?.nodeValue
            }`
          );
        });
    }

    //For-PDF

    // const urlPdf = 'http://localhost:5000/api/pdf';
    // for (let fileNum = 0; fileNum < this.files.length; fileNum++) {

    //   let body = {
    //     token: this.token,
    //     uri: this.files[fileNum].uri,
    //   };
    //   console.log(`Token : ${this.token}`);
    //   console.log(`URI-${fileNum}: ${this.files[fileNum].uri}`);
    //   console.time(`${fileNum}`);

    //    this.http.post<any>(urlPdf, body, { responseType: "blob" as 'json' })
    //   .subscribe(async (res) => {
    //       let pdfFile = res;

    //         let blob = await this.processFileResponse(
    //             pdfFile,
    //           'demonahihai.pdf',
    //           'blob'
    //         );
    //         await  this.downloadFile(blob, 'newFile.pdf');

    //   });
    // }
  }
}
