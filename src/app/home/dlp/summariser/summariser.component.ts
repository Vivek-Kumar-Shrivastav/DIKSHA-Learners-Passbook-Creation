import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Subject } from '../../../../HelperInterfaces/CertificateData';
import { SummariserService } from './summariser.service';
import { DownloadAsPdfService } from 'src/app/service/download-as-pdf.service';
import { Certificate } from '../../../../HelperInterfaces/CertificateData';

@Component({
  selector: 'app-summariser',
  templateUrl: './summariser.component.html',
  styleUrls: ['./summariser.component.css'],
  providers: [SummariserService],
})
export class SummariserComponent implements OnInit, OnChanges {
  // @Input() certificate :  Certificate  = {} as Certificate;
  @Input() certificateOf: string = '';
  @Input() subjects: Subject[] = [];
  @Input() uri: string = '';
  @Input() rollNumber: string = '';
  
  value: any = 'default';

  schoolSubjects = {
    math: ['math'],
    science: ['science', 'bio', 'chemi', 'physic', 'science'],
    commerce: ['accountancy', 'business', 'economics'],
    social_science: [
      'social',
      'history',
      'geography',
      'civic',
      'economic',
      'polit',
    ],
    skill_subject: [
      'information',
      'legal',
      'fashion',
      'mass',
      'entreprene',
      'agriculture',
      'engineering',
      'fine',
      'yoga',
      'sangeet',
    ],
    language: [
      'english',
      'hindi',
      'gujrati',
      'urdu',
      'sanskrit',
      'punjabi',
      'bengali',
      'bangla',
      'tamil',
      'telugu',
      'oriya',
      'sindhi',
      'marathi',
      'gujarati',
      'malyalam',
      'pali',
      'manipuri',
      'parsi',
      'malayalam',
      'odia',
      'assamese',
      'kannada',
      'arabic',
      'tibetan',
      'french',
      'german',
      'russian',
      'persian',
      'nepali',
      'limboo',
      'lepcha',
      'telugu telangana',
      'bodo',
      'tangkhul',
      'japanese',
      'bhutia',
      'spanish',
      'kashmiri',
      'mizo',
      'bahasa melayu',
    ],
  };
  strength: Object = {
    10: 'Exceptional',
    9: 'phenomenal',
    8: 'excellent',
    7: 'good',
    6: 'hardWorking',
    other: 'persevering',
  };

  certificateDetails: string[] = [this.certificateOf, this.rollNumber];

  // Summarised Report
  summaryReport: string[][] = [[]];
  project = 'default';
  constructor(
    private _summariserService: SummariserService,
    private _pdfService: DownloadAsPdfService,
    ) {}
  async ngOnInit() {
    // window.location.reload();
    this.summaryReport = await this._summariserService.summarise(this.subjects); 
    console.log(`Summary :${this.summaryReport}`);
     let report =  await this._summariserService.getSummary();
    
     for(let i= 0; i < report.length; i++){
      for(let j=0; j < report[i].length; j++){
        // for(let k=0; k < report[i][j].length; k++)
            console.log(`Test ${report[i][j]}`);
      }
    }
    // this._pdfService.generatePDF(this,this.summaryReport, this.certificateDetails);
  }
  
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
  }

}
