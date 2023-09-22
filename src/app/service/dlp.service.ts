import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDataService } from '../service/user-data.service';
import { File } from 'src/HelperInterfaces/Files';
import { ResolveEnd } from '@angular/router';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DlpService {
  private studentData: any = [];

  private token: string = '';
  files: File[] = [];
  flag = false;
  dataBase : object[] = [];
  constructor(
    private http: HttpClient,
    private _userDataService: UserDataService,
  ) { }
  private processFileResponse(pdf: any, fileName: string, render: string): Promise<Blob> {
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

    getToken(code): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      // console.log('Inside getToken');

      const tokenURL = 'http://localhost:5000/api/token';
      let body = { code: code };
      // console.log(`Body-Code : ${body.code}`);
      let accessToken = '';

      this.http.post<any>(tokenURL, body).subscribe({
        next: (response) => {

          accessToken = response.access_token;
          console.log(`Token : ${response.access_token}`);
          // console.log(`getToken() = ${accessToken}`);
          resolve(accessToken);
                
          // this.token = accessToken;
          // {
          //   this.getDetails(accessToken);
          //   // console.log('Details fetched !!!');
          //   this.getFiles(accessToken);
          // }
        },
        error: (err) => {
          accessToken = '';
          // console.log('API Error: ', err);
          reject(accessToken);
        },
      });
    });
  }

  getDetails(token : string) {
    // console.log('Inside getDetails');
    // let body = { code: this.code };
    const details = 'http://localhost:5000/api/details';
    // const body = {'token': response.access_token};
    try {
       this.http
        .get<any>(details, {params: {token: token,}})
        .subscribe((det) => {
          console.log(`Details in service : ${det}`);
          return det;
        });
      // console.log(`Details Fetched`);
    } catch (err) {
      // console.log(`Error in details : ${err}`);
    }
  }
  async getFiles(token : string): Promise<File[]> {
  //  console.log('Inside getFiles');
  return new Promise((resolve, reject) =>{
    const filesURL = 'http://localhost:5000/api/files';
    const body = { token: token };
     this.http.post<any>(filesURL, body).subscribe({
      next: (files) => {
        console.log(`Files Length : ${files.items.length}`);
        console.log(`File items : ${typeof files.items[0]}`)
        this.files = files.items;
        resolve(this.files);
        this.storeFile(token);
        console.log(`Files in service  : ${files.items}`)
      },
      error: (err) => {
        reject([])
        console.error(`Files not loaded!!!, ${err}`);
      },
    });
  })
}
  
  storeFile(token : string) : Promise<boolean>{
    let count = 0;
    return new Promise((resolve) =>{
      console.log('Inside storeFile');
      const urlXml = 'http://localhost:5000/api/file';
      for (let fileNum = 0; fileNum < this.files.length; fileNum++) {
        let body = {
          token: token,
          uri: this.files[fileNum]?.uri,
          name : this.files[fileNum]?.name,
        };
        // console.log(`URI-${fileNum}: ${this.files[fileNum].uri}`);
        // console.time(`${fileNum}`);
  
        this.http
          .post<any>(urlXml, body, { responseType: 'json' })
          .subscribe({
            next : (res) => {
            let xmlFile: string = res.xml; // xml-File
            let name= body.name;
  
            var parser = new DOMParser();
            var xml = parser.parseFromString(xmlFile, 'text/xml');
            let noXml = xml.getElementsByTagName('NoXml')[0]?.childNodes[0]?.nodeValue;
            // console.log("NoXml :", noXml, name)
  
            // Filtering :  Check if valid XML file is received from DigiLocker
            if(noXml === null || noXml === undefined)
            { 
              // Chek if name field is empty and give new name based on URI
              if(body.name == '' || body.name == undefined || body.name == null){
                  let uri :string = body.uri;
                  let arr : string[] = uri.split('.');
                  let rootValue = arr[2];
                  let organisation = rootValue.split('-')[0].toUpperCase();
                  let value = rootValue.split('-')[1].toUpperCase();
                  name = organisation + " : " + value;
              }
              let data = { name : name, uri: body.uri, xml: xmlFile }; // [uri, xml]
              // this.dataBase.push(data);
              this._userDataService.updateData(fileNum, JSON.stringify(data));
              // this.studentData.push(this._userDataService.getData(fileNum));
              // console.log(this._userDataService.getData(fileNum));
            }
            if(fileNum == this.files.length-1) {
              resolve(true);
            }
          },
           error:  (error) => {
             resolve(false);
           }
                  // when xml not received
        });
    }
  })
}

    //For-PDF

    // const urlPdf = 'http://localhost:5000/api/pdf';
    // for (let fileNum = 0; fileNum < this.files.length; fileNum++) {

    //   let body = {
    //     token: this.token,
    //     uri: this.files[fileNum].uri,
    //   };
      // console.log(`Token : ${this.token}`);
      // console.log(`URI-${fileNum}: ${this.files[fileNum].uri}`);
      // console.time(`${fileNum}`);

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
