import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
  studentData: string[] = [];

  constructor(
    private authorize: GetAuthorisatonService,
    private http: HttpClient,
    private _dataService: UserDataService
  ) {}

  getToken() {
    const url = 'http://localhost:5000/api/authorise';
    this.authorize.getAuthcode(url).subscribe((response) => {
      console.log(response);
      const tab = window.open(response.url);
      const int = setInterval(() => {
        if (tab?.closed) {
          // window.alert("Windows closed");
          clearInterval(int);
        } else {
          const url = tab?.location.href;

          // window.alert(url);
          // window.alert("Windows is open");

          const param = new URLSearchParams(url?.split('?')[1]);
          const code = param.get('code');

          console.log('inside else : tab is open');
          if (code) {
            console.log('inside if : got the code');
            console.log(code);
            clearInterval(int);
            let body = { code: code };
            console.log(`Body : ${body}`);

            const token = 'http://localhost:5000/api/token';
            this.http.post<any>(token, body).subscribe({
              next: (response) => {
                console.log(response);
                const details = 'http://localhost:5000/api/details';
                // const body = {'token': response.access_token};

                this.http
                  .get<any>(details, {
                    params: {
                      token: response.access_token,
                    },
                  })
                  .subscribe((det) => {
                    console.log(`Details : ${det}`);
                    const files = 'http://localhost:5000/api/files';
                    const params = new HttpParams().set(
                      'token',
                      response.access_token
                    );

                    this.http
                      .get<any>(files, { params: params })
                      .subscribe((files) => {
                        console.log(`Length : ${files.items.length}`);
                        const file = 'http://localhost:5000/api/file';

                        let params = new HttpParams().set(
                          'token',
                          response.access_token
                        );
                        for (let fileNum = 1; fileNum < files.items.length;fileNum++) {
                          params = params.set('uri', files.items[fileNum].uri);
                          console.log(`URI: ${files.items[fileNum].uri}`);

                          this.http
                            .get<any>(file, {
                              params: params,
                              responseType: 'text' as 'json',
                            })
                            .subscribe((file) => {
                              var parser = new DOMParser();
                              // Use it to turn your xmlString into an XMLDocument
                              var xmlDoc = parser.parseFromString(
                                file,
                                'text/xml'
                              );
                              // this.studentData  = file;

                              this._dataService.updateData(fileNum, file);
                              this.studentData.push(this._dataService.getData(`${fileNum}`));

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
                      });
                  });
              },
              error: (error) => {
                console.log('API Error: ', error);
              },
            });
          }
        }
      }, 1000);
    });
  }
}
