import { Component, Input, OnInit} from '@angular/core';
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
export class SummariserComponent implements OnInit {
  // @Input() certificate :  Certificate  = {} as Certificate;
  @Input() certificateOf: string = '';
  @Input() subjects: Subject[] = [];
  @Input() uri: string = '';
  @Input() rollNumber: string = '';
  
  value: any = 'default';

  schoolSubjects = {
    Math: ['math'],
    Science: ['science', 'bio', 'chemi', 'physic', 'science'],
    Commerce: ['accountancy', 'business', 'economics'],
    Social_Science: [
      'social',
      'history',
      'geography',
      'civic',
      'economic',
      'polit',
    ],
    Skill_Subjects: [
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
    Language: [
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
    9: 'Phenomenal',
    8: 'Excellent',
    7: 'Good',
    6: 'HardWorking',
    other: 'Persevering',
  };

  // Summarised Report
  summaryReport: string[][] = [[]];
  project = 'default';
  constructor(
    private _summariserService: SummariserService,
    private _pdfService: DownloadAsPdfService,
    ) {}
  async ngOnInit() {
    // window.location.reload();
    this.summaryReport = await this._summariserService.summarise(this.certificateOf, this.rollNumber, this.subjects); 
  
    console.log(`Summary :${this.summaryReport}`);
  
  }
  


}
