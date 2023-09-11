import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  @Input() certificate;
  @Input() subjects;
  @Input() uri;
  @Input() rollNumber;


  constructor(private http: HttpClient) {}
  async download() {
    try {
      let token = await this.getToken();
      let body = {
        uri: this.uri, 
        token: token,
      };
      // window.open(this.pdf, '_blank');
      let pdfResponse = await lastValueFrom(
        this.http.post<any>('/api/pdf', body, {responseType: 'blob' as 'json'})
      );
      
      pdfResponse.subscribe({
        next: async (res) => {
          let pdf: string = res; // pdf-File
          //  console.log(`pdf : ${pdf}, XML : ${xmlString}`);

          let fileType = `${res}`.split(';')[0];
          let render = 'blob';
          if (fileType == 'data:application/pdf') {
            render = 'base64';
            console.log(
              `Render : ${render} and Rendering \n ${JSON.stringify(res)}`
            );
          } else {
            console.log(
              `Render : ${`${res}`.split('%')[1]} and Rendering \n ${res}`
            );
          }

          let blob = await this.processFileResponse(
            res,
            'demonahihai.pdf',
            'blob'
          );
          this.downloadFile(blob, 'newFile.pdf');
        },
        error: (err) => {
          console.log('Error in downloading pdf', err);
        },
      });
    } catch (err) {
      console.log('Erro received', err);
    }
    //get user consent and then download.
  }
  getToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      console.log('Inside getToken');

      const tokenURL = 'http://localhost:5000/api/token';
      let body = { code: localStorage.getItem('code') };
      console.log(`Body-Code : ${body.code}`);
      let accessToken = '';

      this.http.post<any>(tokenURL, body).subscribe({
        next: (response) => {
          accessToken = response.access_token;
          // console.log(`Response : ${response.access_token}`);
          console.log(`getToken() = ${accessToken}`);
          console.log(`Token Fetched : ${accessToken}`);
          resolve(accessToken);
        },
        error: (err) => {
          accessToken = 'No Token';
          console.log('API Error: ', err);
          reject('no-access');
        },
      });
    });
    //Testing
    // console.log(`Returning accesToken : ${accessToken}`);
    // return accessToken;
  }
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
    console.log('Downloading File...');
    // rewoke URL after 15 minutes    OR  Additionally, use can add the user(Accessor_) with grant he/she will always be able to access the docs
    // setTimeout(() => {
    //   window.URL.revokeObjectURL(url);
    // }, 30 * 60 * 1000);
  }
}
