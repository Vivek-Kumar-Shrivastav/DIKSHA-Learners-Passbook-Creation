import { Component , OnInit, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetAuthorisatonService } from '../service/get-authorisaton.service';
import { UserDataService } from '../service/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private studentData: any = [];
  private code: string = '';
  private token: string = '';
  files: any = [];
  selectedFiles : string[] = [];
  flag = false;

  constructor(
    private _authorize: GetAuthorisatonService,
    private http: HttpClient,
    private _userDataService: UserDataService,
  ) {}
  
  ngOnInit(): void {
    // localStorage.clear();
  }
  ngOnDestroy(): void {
    localStorage.clear();
  }

  toggleSelection(file: string) {
    // Toggle the selection of the checkbox file
    if (this.selectedFiles.includes(file)) {
      this.selectedFiles = this.selectedFiles.filter(item => item !== file);
    } else {
      this.selectedFiles.push(file);
    }
  }

  showSelectedOptions() {
    // This method is called when the "Show Selected Options" button is clicked
    console.log('Selected Options:', this.selectedFiles);
    // You can perform further actions with the selected options here
  }

  getAuthCode() {
    const url = 'http://localhost:5000/api/authorise';
    this._authorize.getAuthcode(url).subscribe(async (response) => {
      // console.log(response);
      const tab = window.open(response.url);
      const interval = setInterval(async () => {
        if (tab?.closed) {
          // window.alert("Windows closed");
          clearInterval(interval);
        } else {
          try{

            const url = tab?.location.href;

            const param = new URLSearchParams(url?.split('?')[1]);
            //Auth-Code
            this.code = param.get('code') !== null ? param.get('code')! : '';
            // console.log('inside else : tab is open');
            if (this.code !== '') {
              // console.log('inside if : got the code');
              // console.log(this.code);

              //Store code in storage or session
              // localStorage.setItem('code', this.code);
              clearInterval(interval);

              let body = { code: this.code };
              // console.log(`Body : ${body}`);
              let status  = await this.getToken();
              console.log(`Going to fetch the details and Token = ${this.token}`);
            }
          }
          catch (err){
            console.log("Server errror");  // Show Pages 501 or Ask to retry
            // this.getAuthCode();
          }
        }
      }, 1000);
    });
  }

  // Helper functions

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

  private  getToken(flag = 'details'): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      // console.log('Inside getToken');

      const tokenURL = 'http://localhost:5000/api/token';
      let body = { code: this.code };
      // console.log(`Body-Code : ${body.code}`);
      let accessToken = '';

      this.http.post<any>(tokenURL, body).subscribe({
        next: (response) => {
          resolve('access_granted');

          accessToken = response.access_token;
          console.log(`Response : ${response.access_token}`);
          // console.log(`getToken() = ${accessToken}`);
          this.token = accessToken;
          if (flag === 'details') {
            this.getDetails(accessToken);
            // console.log('Details fetched !!!');
            this.getFiles(accessToken);
          }
        },
        error: (err) => {
          accessToken = 'No Token';
          // console.log('API Error: ', err);
          reject('no_access');
        },
      });
    });
  }

  private  getDetails(receivedToken : string) {
    // console.log('Inside getDetails');
    // let body = { code: this.code };
    const details = 'http://localhost:5000/api/details';
    // const body = {'token': response.access_token};
    try {
       this.http
        .get<any>(details, {
          params: {
            token: receivedToken,
          },
        })
        .subscribe((det) => {
          // console.log(`Details : ${det}`);
          return det;
        });
      // console.log(`Details Fetched`);
    } catch (err) {
      // console.log(`Error in details : ${err}`);
    }
  }
  private async getFiles(token : string): Promise<any> {
  //  console.log('Inside getFiles');
    const filesURL = 'http://localhost:5000/api/files';
    const body = { token: token };
     this.http.post<any>(filesURL, body).subscribe({
      next:  (files) => {
        console.log(`Files Length : ${files.items.length}`);
        console.log(`File items : ${files.items[0].uri}`)
        this.files = files.items;
        this.flag = true;
        this.storeFile();        
      },
      error: (err) => {
        // console.error(`Files not loaded!!!, ${err}`);
      },
    })
  }
  
  private storeFile() {
    console.log('Inside storeFile');
    const urlXml = 'http://localhost:5000/api/file';
    for (let fileNum = 0; fileNum < this.files.length; fileNum++) {
      let body = {
        token: this.token,
        uri: this.files[fileNum].uri,
        name : this.files[fileNum].name,
      };
      // console.log(`Token : ${this.token}`);
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
          console.log("NoXml :", noXml, name)

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
            let data = JSON.stringify({ name : name, uri: body.uri, xml: xmlFile }); // [uri, xml]

            this._userDataService.updateData(fileNum, data);
            this.studentData.push(this._userDataService.getData(fileNum));
            // console.log(this._userDataService.getData(fileNum));
          } 
         
    
        },
         error:  (error) => {}
                // when xml not received
        });
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
}
