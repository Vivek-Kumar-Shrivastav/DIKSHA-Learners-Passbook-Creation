import { Component, Input, OnInit } from '@angular/core';
import { Subject } from '../../HelperInterfaces/CertificateData';

interface Subjects {
  name: string;
  marksObtained: number;
  totalMarks: number;
  strength: string; // Assuming strength is a string, you can adjust the type as needed
}
interface Aggregate {
  obtained: number;
  max: number;
  strength: string; // Assuming strength is a string, you can adjust the type as needed
}

interface Schema {
  array: Subjects[];
  performance: Aggregate;
}

@Component({
  selector: 'app-summariser',
  templateUrl: './summariser.component.html',
  styleUrls: ['./summariser.component.css'],
})



export class SummariserComponent implements OnInit {
  @Input() certificate: string = '';
  @Input() subjects: Subject[] = [];
  @Input() uri: string = '';
  @Input() rollNumber: string = '';

  value: any = 'default';
  
  schoolSubjects = {
    math: ['math'],
    science: ['science', 'bio', 'chemi', 'physic', 'science'],
    commerce: ['accountancy', 'business', 'economics'],
    social_science: [
      'social','history','geography','civic','economic','polit',],
    skill_subject: [
      'information','legal','fashion','mass','entreprene','agriculture','engineering','fine','yoga','sangeet'],
    language: [
      'english','hindi', 'gujrati', 'urdu','sanskrit','punjabi','bengali', 'bangla', 'tamil','telugu', 'oriya', 'sindhi','marathi','gujarati', 'malyalam', 'pali', 'manipuri', 'parsi','malayalam','odia','assamese','kannada','arabic','tibetan','french','german','russian','persian','nepali','limboo','lepcha','telugu telangana','bodo','tangkhul','japanese','bhutia','spanish','kashmiri','mizo','bahasa melayu',
    ],
  };

  strength: Object = {
    10: "Exceptional",
    9: 'phenomenal',
    8: 'excellent',
    7: 'good',
    6: 'hardWorking',
    other: 'persevering',
  };

  // Summarised Report
  summaryReport : string[][]= [[]];
  passbook: string[] = [];
  FinalReport = [];
  constructor() {}
  ngOnInit(): void {
    this.process();
  }

  giveStrength(marksObtained: number, totalMarks: number)  : Promise<string>{
    return new Promise((resolve, reject)=>{
      let calaulatedStrength = 'persevering';
      let percentage = `${Math.floor((marksObtained * 1) / (totalMarks * 1)*10)}`;
      if (this.strength.hasOwnProperty(percentage)) {
        calaulatedStrength = this.strength[percentage];
      }
      resolve(calaulatedStrength);
  })
}

  typeOf(value: any) {
    return typeof value;
  }
  async process() {
    let category : number= 0;
    for (let subjectCategory in this.schoolSubjects) {
      // subjectCategory is an array
      let array: Subjects[] = [];
      let aggregator: Aggregate = {
        obtained: 0,
        max: 0,
        strength: 'persevering',
      };

      let categoryReport: Schema = { array: [], performance: aggregator };
      for (let subject of this.schoolSubjects[subjectCategory]) {
        for (let currentSubject of this.subjects) {
          let name: string = currentSubject.name;
          let marksObtained: number = +currentSubject.marksObtained;
          let totalMarks: number = +currentSubject.totalMarks;
          // console.log(
          //   `Name : ${name}, MarksObt : ${marksObtained} and TotalMarks : ${totalMarks}`
          // );

          let contains: boolean = name.toLowerCase().includes(subject);
          if (contains == true) {
            let calaulatedStrength: string = await this.giveStrength(
              marksObtained,
              totalMarks
            );
            let subject: Subjects = {
              name: name,
              marksObtained: marksObtained,
              totalMarks: totalMarks,
              strength: calaulatedStrength,
            };
           
            // let individualReport = `Student has obtained ${aggregator.obtained} marks out of ${aggregator.max} and shown ${aggregator.strength} nature in field of ${subjectCategory}`;
            // this.summaryReport[category++] = [subject.name, `${subject.marksObtained}`, `${subject.totalMarks}`, `${subject.strength}`];

            aggregator.obtained += marksObtained;
            aggregator.max += totalMarks;
            aggregator.strength = await this.giveStrength(
              aggregator.obtained,
              aggregator.max
            );
            break;
          }
        }
        // O : category, 1..n-2 : Subjects, n-1: Aggregate
        //This eliminates the category(s) which is(are) not in the Certificate
      }

      if (categoryReport.performance.obtained != 0) {
        let finalReport = `Student has obtained ${aggregator.obtained} marks out of ${aggregator.max} and shown ${aggregator.strength} nature in field of ${subjectCategory}`;
        this.summaryReport[category++] = ["Category "+subjectCategory, `${aggregator.obtained}`, `${aggregator.max}`, `${aggregator.strength}`];
      }
    }
  }
}
