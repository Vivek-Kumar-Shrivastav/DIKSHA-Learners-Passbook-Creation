import { Component , OnInit, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthorisatonService } from '../service/get-authorisaton.service';
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
    private _authorizeService: AuthorisatonService,
    private http: HttpClient,
    private _userDataService: UserDataService,
  ) {}
  
  ngOnInit(): void {
    // localStorage.clear();
  }
  ngOnDestroy(): void {
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
    console.log("auth code generation");
    const url = 'http://localhost:5000/api/authorise';
    this._authorizeService.getAuthcode(url).subscribe(async (response) => {
      // console.log(response);
     window.location.replace(response.url);
  })
}
}
