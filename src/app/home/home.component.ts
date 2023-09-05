import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {combineLatest,
  Observable,
} from 'rxjs';
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

          // window.alert(url);
          // window.alert("Windows is open");

          const param = new URLSearchParams(url?.split('?')[1]);

          //Auth-Code
          this.code = param.get('code') !== null ? param.get('code')! : '';

          console.log('inside else : tab is open');
          if (this.code !== '') {
            console.log('inside if : got the code');
            console.log(this.code);

            //Temp
            localStorage.setItem("code", this.code);

            clearInterval(interval);
            let body = { code: this.code };
            console.log(`Body : ${body}`);

            //=========================================BREAK-POINT======================================//
            //Accesing-Token
            this.getToken();
            // Try to get access token here using async-await

            /* 
              console.timeEnd("getToken");
              console.log(`got token : ${this.token}`);
            */

            //Getting-User-Details

            console.log(`Going to fetch the details and Token = ${this.token}`);
            // this.getDetails();

            // Get-All-Files
            // this.files = await this.getFiles();
            // console.log(`Files : ${this.files}`);

            // console.log(`Length itni hai : ${this.files.length}`);  // Done till here.
            // // const url = 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/file/in.gov.pan-PANCR-IWPPS2386E';
            // const file = 'http://localhost:5000/api/file';
            // for (let fileNum = 0; fileNum < this.files.length;fileNum++)
            // {
            //   // console.log(`URI: ${files.items[fileNum].uri}`);
            //   let params = new HttpParams().set('token', response.access_token)
            //   .set(`uri`, this.files[fileNum].uri);
            //   console.log(`URI-${fileNum}: ${this.files[fileNum].uri}`);
            //    await this.http.get<any>(
            //     file,
            //     {
            //       params: params,
            //       responseType: 'arraybuffer' as 'json',
            //     }
            //   )
            //   .subscribe(async (res)=>{
            //     let xmlString :string = res[1];
            //     let pdf :string  = pdf;
            //     let blob : string = "" ;

            //     let fileType  = await pdf.split(";")[0];
            //     let render = "blob";
            //     if(fileType == "data:application/pdf"){
            //       render = "base64";
            //       // console.log(`Render : ${render} and Rendering \n ${res}`);
            //     }
            //     else{
            //       // console.log(`Render : ${`${res}`.split("%")[1]}} and Rendering \n ${res}`);
            //     }

            //     blob = await this.processFileResponse(res, "demonahihai.pdf", render)!;
            //     // this.downloadFile(res, "demonahihai.pdf");

            //     // Use it to turn your xmlString into an XMLDocument
            //     var parser = new DOMParser();
            //     var xmlDoc = parser.parseFromString(
            //       xmlString,
            //       'text/xml'
            //     );
            //     // this.studentData  = file;

            //     let data = JSON.stringify([blob, xmlString]);
            //     this._userDataService.updateData(fileNum, data);
            //     this.studentData.push(this._userDataService.getData(fileNum));

            //     // this._userDataService.getData().subscribe(res=>{
            //     //     this.studentData = res;
            //     // })

            //     console.log(
            //      `${ xmlDoc.getElementsByTagName('Certificate')[0].getAttribute('name')},
            //       ${file}`
            //     )
            //   })
            // }
          }
        }
      }, 1000);
    });
  }
  // Helper functions
  async processFileResponse(pdf: any, fileName: string, render: string) {
    if (render === 'base64') {
      this.base64Response = pdf;
      const binaryString = window.atob(pdf);
      const bytes = new Uint8Array(binaryString.length);
      const binaryToBlob = bytes.map((byte, i) => binaryString.charCodeAt(i));
      const blob = new Blob([binaryToBlob], { type: 'application/pdf' });
      this.downloadFile(blob, fileName);
    } else {
      const blob = new Blob([pdf], { type: 'application/pdf' });
      this.downloadFile(blob, fileName);
    }
  }
  async downloadFile(blob: any, fileName: string) {
    // Other Browsers
    const url = (window.URL || window.webkitURL).createObjectURL(blob);
    window.open(url, '_blank');

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
        next:  (response) => {
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
          resolve("no-access");
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

    // Copy-Paste

    // console.log(`Files : ${this.files}`);
    // console.log(`Outsub Length itni hai : ${this.files.length}`);  // Done till here.
    // // const url = 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/file/in.gov.pan-PANCR-IWPPS2386E';

    // const file = 'http://localhost:5000/api/file';
    // for (let fileNum = 0; fileNum < this.files.length;fileNum++)
    // {
    //   // console.log(`URI: ${files.items[fileNum].uri}`);
    //   let params = new HttpParams().set('token', this.token)
    //   .set(`uri`, this.files[fileNum].uri);
    //   console.log(`URI-${fileNum}: ${this.files[fileNum].uri}`);
    //    await this.http.get<any>(
    //     file,
    //     {
    //       params: params,
    //       responseType: 'arraybuffer' as 'json',
    //     }
    //   )
    //     .subscribe(async (res)=>{
    //       let xmlString :string = res[1];
    //       let pdf :string  = pdf;
    //       let blob : string = "" ;

    //       let fileType  = await pdf.split(";")[0];
    //       let render = "blob";
    //       if(fileType == "data:application/pdf"){
    //         render = "base64";
    //         // console.log(`Render : ${render} and Rendering \n ${res}`);
    //       }
    //       else{
    //         // console.log(`Render : ${`${res}`.split("%")[1]}} and Rendering \n ${res}`);
    //       }

    //       blob = await this.processFileResponse(res, "demonahihai.pdf", render)!;
    //       // this.downloadFile(res, "demonahihai.pdf");

    //       // Use it to turn your xmlString into an XMLDocument
    //       var parser = new DOMParser();
    //       var xmlDoc = parser.parseFromString(
    //         xmlString,
    //         'text/xml'
    //       );
    //       // this.studentData  = file;

    //       let data = JSON.stringify([blob, xmlString]);
    //       this._userDataService.updateData(fileNum, data);
    //       this.studentData.push(this._userDataService.getData(fileNum));

    //       // this._userDataService.getData().subscribe(res=>{
    //       //     this.studentData = res;
    //       // })

    //       console.log(
    //        `${ xmlDoc.getElementsByTagName('Certificate')[0].getAttribute('name')},
    //         ${file}`
    //       )
    //     })
    //   }
  }
  async storeFile() {
    console.log('Inside storeFile');
    const fileURI = 'http://localhost:5000/api/file';
    for (let fileNum = 0; fileNum < this.files.length; fileNum++) {
      // console.log(`URI: ${files.items[fileNum].uri}`);
      // let params = new HttpParams().set('token', this.token)
      // .set(`uri`, this.files[fileNum].uri);

      let body = {
        token: this.token,
        uri: this.files[fileNum].uri,
      };
      console.log(`Token : ${this.token}`);
      console.log(`URI-${fileNum}: ${this.files[fileNum].uri}`);
      console.time(`${fileNum}`);

      this.http
        .post<any>(fileURI, body, { responseType: 'text' as 'json' })
        .subscribe(async (res) => {
          let xmlString: string = res; // xml-File
          if (xmlString == 'no-xml') {
            // store  karo url and xml_mein :no-
            xmlString = `<?xml version="1.0" encoding="UTF-8" ?><NoXml>No XML</NoXml>`;
          }

          // console.log(`Response from file ${xmlString}`);
          var parser = new DOMParser();
          var xml = parser.parseFromString(xmlString, 'text/xml');
          let data = JSON.stringify({ uri: body.uri, xml: xmlString }); // [uri, xml]
          console.log("typeof(data)", typeof(data));
          // console.log(`data :${data}`);
          
          await this._userDataService.updateData(fileNum, data);
          await this.studentData.push(this._userDataService.getData(fileNum));
          console.log(this._userDataService.getData(fileNum));

          let isNoXml =
            xml.getElementsByTagName('NoXml')[0]?.childNodes[0]?.nodeValue;
          console.log(
            `NoXml : ${
              xml.getElementsByTagName('NoXml')[0]?.childNodes[0]?.nodeValue
            }`
          );
          // console.log(`${ xml.getElementsByTagName('Certificate')[0]?.getAttribute("name")}`);
          // console.log(`${xml.getElementsByTagName('Certificate')[0]}`);

          /* PDF-CODE
            res = JSON.parse(res);
            let pdf :string  = res.pdf;        // pdf-File
            let blob : string = "" ;
            console.log(`pdf : ${pdf}, XML : ${xmlString}`);

            let fileType  = `${res}`.split(";")[0];
            let render = "blob";

            if(fileType == "data:application/pdf"){
              render = "base64";
              console.log(`Render : ${render} and Rendering \n ${JSON.stringify(res)}`);
            }
            else{ 
              console.log(`Render : ${`${res}`.split("%")[1]} and Rendering \n ${res}`);
            }
          
            this.processFileResponse(res, "demonahihai.pdf", "blob");
          
            XML-File 
            console.timeEnd(`${fileNum}`);
            console.log(`Request-${fileNum} : Finished`);
            */
        });
    }
  }
}

// XML-File

// window.open(blob, '_blank');

// this.downloadFile(res, "demonahihai.pdf");

// Use it to turn your xmlString into an XMLDocument

// var parser = new DOMParser();
// var xmlDoc = parser.parseFromString(
//   xmlString,
//   'text/xml'
// );

// let data = JSON.stringify([blob, xmlDoc]);     // [pdf, xml]
// this._userDataService.updateData(fileNum, data);
// this.studentData.push(this._userDataService.getData(fileNum));

// this._userDataService.getData().subscribe(res=>{
//     this.studentData = res;
// })

// console.log(
//  `${ xmlDoc.getElementsByTagName('Certificate')[0].getAttribute('name')},
//   ${xmlString}`
//   )
