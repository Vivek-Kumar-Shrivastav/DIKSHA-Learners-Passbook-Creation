import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { combineLatest, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GetAuthorisatonService } from '../service/get-authorisaton.service';
import { UserDataService } from '../service/user-data.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
getAuthCode() {
throw new Error('Method not implemented.');
}
  // baseURL: string = "https://api.github.com/";
  studentData: any;
  base64Response: any;
  code : string = "";
  token : string = "";
  files = [];

  constructor(
    private authorize: GetAuthorisatonService,
    private http: HttpClient,
    private _dataService: UserDataService
  ) {}

  getCode() {
    const url = 'http://localhost:5000/api/authorise';
    this.authorize.getAuthcode(url).subscribe((response) => {
      console.log(response);
      const tab = window.open(response.url);
      const int = setInterval(async () => {
        if (tab?.closed) {
          // window.alert("Windows closed");
          clearInterval(int);
        }
        else {
          const url = tab?.location.href;

          // window.alert(url);
          // window.alert("Windows is open");

          const param = new URLSearchParams(url?.split('?')[1]);

          //Auth-Code
          this.code = param.get('code') !== null ? param.get('code')! : "";

          console.log('inside else : tab is open');
          if (this.code) {
            console.log('inside if : got the code');
            console.log(this.code);
            clearInterval(int);
            let body = { code: this.code };
            console.log(`Body : ${body}`);

            //=========================================BREAK-POINT=====================================================//
            //Accesing-Token
            this.token =  await this.getToken()!;

            //Getting-User-Details
            this.getDetails();
               
           // Get-All-Files
            this.files = [...await this.getFiles()];
            const files = 'http://localhost:5000/api/files';

            const params = new HttpParams().set('token', this.token);
            this.http
              .get<any>(files, { params: params })
              .subscribe(async (files) => {
                console.log(`Length itni hai : ${files.items.length}`);  // Done till here.
              
                // const url = 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/file/in.gov.pan-PANCR-IWPPS2386E';
                const file = 'http://localhost:5000/api/file';
                for (let fileNum = 0; fileNum < files.items.length;fileNum++) 
                {  
                  // let fileNum =2;
                  // params = params.set('uri', files.items[fileNum].uri);
                  // console.log(`URI: ${files.items[fileNum].uri}`);

                  let params = new HttpParams().set('token', response.access_token)
                  .set(`uri`, files.items[fileNum].uri);
                  console.log(`URI-${fileNum}: ${files.items[fileNum].uri}`);
                await this.http.get<any>(
                    file,
                    {
                      params: params,
                      responseType: 'arraybuffer' as 'json',
                    }
                  )
                  .subscribe(async (res)=>{
                    let fileType  = `${res[0]}`.split(";")[0];
                    let render = "blob";
                    if(fileType == "data:application/pdf"){
                      render = "base64";
                      // console.log(`Render : ${render} and Rendering \n ${res}`);
                    }
                    else{ 
                      // console.log(`Render : ${`${res}`.split("%")[1]}} and Rendering \n ${res}`);
                    }
                    let blob = await this.processFileResponse(res, "demonahihai.pdf", render);
                    // this.downloadFile(res, "demonahihai.pdf");
                  });

                  // this.http
                  // .get<any>(file, {
                  //   params: params,
                  //   responseType: 'text' as 'json',
                  // })
                  // .subscribe((file) => {
                    var parser = new DOMParser();
                    // Use it to turn your xmlString into an XMLDocument
                    var xmlDoc = parser.parseFromString(
                      file,
                      'text/xml'
                    );
                    // this.studentData  = file;

                    this._dataService.updateData(fileNum, file);
                    this.studentData.push(this._dataService.getData(fileNum));

                    // this._dataService.getData().subscribe(res=>{
                    //     this.studentData = res;
                    // })

                    console.log(
                     `${ xmlDoc
                        .getElementsByTagName('Certificate')[0]
                        .getAttribute('name')} , ${file}`
                    );
                  });
                }
                    // .pipe(map((response) => {
                    //   let file = response.blob();
                    //   var blob = new Blob([file], {
                    //     type: 'application/pdf'
                    //   });

                    //   FileSaver.saveAs(blob, "tes");
                    // })) 

//========================================================================//
                          // .subscribe((response: any) => {
                          //   // const fileReader = new FileReader();
                          //   // fileReader.onloadend = () => {
                          //   //   this.studentData = fileReader.result;
                          //   // };
                          //   // fileReader.readAsDataURL(response);\
                            /*
                          //   var byteCharacters = atob(response.body);
                          //   var byteNumbers = new Array(byteCharacters.length);
                          //   for (var i = 0; i < byteCharacters.length; i++) {
                          //     byteNumbers[i] = byteCharacters.charCodeAt(i);
                          //   }
                          //   var byteArray = new Uint8Array(byteNumbers);
                          //   var file = new Blob([byteArray], { type: 'application/pdf;base64' });
                          //   var fileURL = URL.createObjectURL(file);
                          //   */
                          //  window.open(response.fileURL);
                          // console.log('Mark-5');
                          // console.log(`Type of res : ${typeof(response)}`);
                          
                          // const newBlob = new Blob([response], {type: 'application/pdf'});
                          // const downloadLink = document.createElement('a');
                          // downloadLink.target = '_self';
                          // const fileName = 'pdf_file.pdf';
                          // const data = window.URL.createObjectURL(newBlob);
                          // downloadLink.href = data;
                          // downloadLink.download = fileName;
                          // document.body.appendChild(downloadLink);
                          // downloadLink.click();
                          
                          // this.studentData = data;
                          // // window.open(url);

                          // // console.log(`File URL : ${url}`);         
                          //    this._dataService.updateData(1, "Vivek");
                          // });

                        // .subscribe((file) => {
                        // var parser = new DOMParser();
                        // Use it to turn your xmlString into an XMLDocument
                        /*var xmlDoc = parser.parseFromString(
                                file,
                                'text/xml'
                              );*/
                        // this.studentData  = file;

                        // this._dataService.updateData(1, file);
                        // this.studentData = file;

                        // this._dataService.getData().subscribe(res=>{
                        //     this.studentData = res;
                        // })

                        /* console.log(
                               `${ xmlDoc
                                  .getElementsByTagName('Certificate')[0]
                                  .getAttribute('name')} , ${file}`
                              );*/
                        // });
                        // }

            
                
              
            
          })
        }
      }}, 1000);



  private processFileResponse(fileResponseData: any, fileName: string, render: string): void {
    if (render === 'base64') {
      this.base64Response = fileResponseData;
      const binaryString = window.atob(fileResponseData);
      const bytes = new Uint8Array(binaryString.length);
      const binaryToBlob = bytes.map((byte, i) => binaryString.charCodeAt(i));
      const blob = new Blob([binaryToBlob], { type: 'application/pdf' });
      this.downloadFile(blob, fileName);
    } else {
      const blob = new Blob([fileResponseData], { type: 'application/pdf' });
      this.downloadFile(blob, fileName);
    }
  }
  private async downloadFile(blob: any, fileName: string): Promise<void> {
    
    // Other Browsers
    const url = await (window.URL || window.webkitURL).createObjectURL(blob);
    await window.open(url, '_blank');
  
    // rewoke URL after 15 minutes
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 15 * 60 * 1000);
  }
  
  async getToken() : Promise<string>{
    const token = 'http://localhost:5000/api/token';
    let body = { code: this.code };
    console.log(`Body : ${body}`);
    let tokenId = "";
    await this.http.post<any>(token, body).subscribe({
      next: (response) => {
        console.log(response);
        tokenId = response.access_token;
      },
      error: ((err)=>{
        tokenId = "No Token";
        console.log('API Error: ', err);
      })
    })
    return tokenId;
  }
  async getDetails(){
    let body = { code: this.code };
    const details = 'http://localhost:5000/api/details';
        // const body = {'token': response.access_token};

    this.http
      .get<any>(details, {
        params: {
          token: this.token,
        },
      })
      .subscribe((det) => {
        console.log(`Details : ${det}`);
      })
  }
  
  async getFiles() {
    const filesURL= 'http://localhost:5000/api/files';
    const params = new HttpParams().set('token', this.token);
    let fileCollection= [];
    this.http
      .get<any>(filesURL, { params: params })
      .subscribe(async (files) => {
        console.log(`Length itni hai : ${files.items.length}`); 
        fileCollection = files.items;
    });
   return fileCollection;
  }

}
