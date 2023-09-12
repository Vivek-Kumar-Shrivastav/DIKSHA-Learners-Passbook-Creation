import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { UserDataService } from '../../service/user-data.service';
import { Credentials } from '../../../HelperInterfaces/Credendials';
import { Certificate } from '../../../HelperInterfaces/CertificateData';
import { DataBaseService } from '../../service/data-base.service';

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
  showTable: boolean = true;
  tableOrSummary: string = 'Show Summary';
  certificate: Certificate;
  coCurricularActivities: Certificate[];
  extraCurricularActivities: any = [];
  curricularActivities: any = [];

  constructor(
    private _userDataService: UserDataService,
    private _dataBase: DataBaseService
  ) {
    this.certificate = {
      certificateOf: '',
      uri: '',
      subjects: [],
      rollNumber: '',
    };
    this.coCurricularActivities = [];
    this.extraCurricularActivities = [];
    this.curricularActivities = [];
  }

  async ngOnInit() {
    await this._dataBase.getDataFromLocalStorage(
      this.user,
      this.coCurricularActivities
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
  }
  ngOnDestroy(): void {
    // localStorage.clear();
  }

  isTable() {
    this.showTable = !this.showTable;
    if (this.showTable == true) {
      this.tableOrSummary = 'Show Summary';
    } else {
      this.tableOrSummary = 'Show Table;';
    }
  }

  printData() {
    this._userDataService.printData();
  }
}
