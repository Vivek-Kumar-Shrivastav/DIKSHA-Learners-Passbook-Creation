import { Injectable } from '@angular/core';
import { Subject } from '../../../../HelperInterfaces/CertificateData';
import { SubjectPerformanceCard } from 'src/HelperInterfaces/SubjectPerformanceCard';
import { CategoryPerformanceCard } from 'src/HelperInterfaces/CategoryPerformanceCard';
import { PerformanceCard } from 'src/HelperInterfaces/PerformanceCard';
import { DownloadAsPdfService } from 'src/app/service/download-as-pdf.service';

@Injectable()
export class SummariserService {
  constructor(private _pdfService: DownloadAsPdfService) {}

  getIndex(): number {
    let index = localStorage.getItem('academicRecord');
    if (index == null) {
      localStorage.setItem('academicRecord', '0');
      return 0;
    }
    let newIndex = +index + 1;
    localStorage.setItem('academicRecord', `${newIndex}`);
    return newIndex;
  }

  // Final Report Card
  private summaryReport: string[][] = [[]];

  // Category wise subjects List
  private schoolSubjects = {
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
    Skill_Subject: [
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

  //Competency Level
  private strength: Object = {
    10: 'Exceptional',
    9: 'Phenomenal',
    8: 'Excellent',
    7: 'Good',
    6: 'HardWorking',
    other: 'Persevering',
  };

  // Caculates the competency of student in given subject/category
  private giveStrength(
    marksObtained: number,
    totalMarks: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let calaulatedStrength = 'persevering';
      let percentage = `${Math.floor(
        ((marksObtained * 1) / (totalMarks * 1)) * 10
      )}`;
      if (this.strength.hasOwnProperty(percentage)) {
        calaulatedStrength = this.strength[percentage];
      }
      resolve(calaulatedStrength);
    });
  }

  // Generates & returns the summary
  async summarise(certificate : string, rollNum : string , subjects: Subject[]): Promise<Array<Array<string>>> {
    return new Promise(async (resolve) => {
      let category: number = 0;

      // Add the 
      for (let subjectCategory in this.schoolSubjects) {
        // subjectsPerformance is an array of subjectsPerformanceCard
        let subjectsPerformance: SubjectPerformanceCard[] = [];
        let categoryPerformance: CategoryPerformanceCard = {
          obtainedMarks: 0,
          maxMarks: 0,
          strength: 'persevering',
        };

        let categoryReport: PerformanceCard = {
          subjectsPerformanceCard: subjectsPerformance,
          categoryPerformanceCard: categoryPerformance,
        };
        for (let subject of this.schoolSubjects[subjectCategory]) {
          for (let currentSubject of subjects) {
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
              let subject: SubjectPerformanceCard = {
                name: name,
                marksObtained: marksObtained,
                totalMarks: totalMarks,
                strength: calaulatedStrength,
              };

              // let individualReport = `Student has obtainedMarks ${categoryPerformance.obtainedMarks} marks out of ${categoryPerformance.maxMarks} and shown ${categoryPerformance.strength} nature in field of ${subjectCategory}`;
              // this.summaryReport[category++] = [subject.name, `${subject.marksObtained}`, `${subject.totalMarks}`, `${subject.strength}`];

              categoryPerformance.obtainedMarks += marksObtained;
              categoryPerformance.maxMarks += totalMarks;
              categoryPerformance.strength = await this.giveStrength(
                categoryPerformance.obtainedMarks,
                categoryPerformance.maxMarks
              );
              break;
            }
          }
          // O : category, 1..n-2 : SubjectPerformanceCard, n-1: CategoryPerformanceCard
          //This loop eliminates the category(s) which is(are) not in the Certificate
        }

        //Check if any subject falls into current CategoryPerformanceCard of SubjectPerformanceCard
        if (categoryReport.categoryPerformanceCard.obtainedMarks != 0) {
          // let finalReport = `Student has obtainedMarks ${categoryPerformance.obtainedMarks} marks out of ${categoryPerformance.maxMarks} and shown ${categoryPerformance.strength} nature in field of ${subjectCategory}`;
          this.summaryReport[category++] = [
            subjectCategory,
            `${categoryPerformance.obtainedMarks}`,
            `${categoryPerformance.maxMarks}`,
            `${categoryPerformance.strength}`,
          ];
        }
      }
      // return this.summaryReport;
      // this.ReportCard.push(this.summaryReport);
      console.log(`Summary service : ${this.summaryReport}`);
      let index = this.getIndex();
      if(index ==0 ){
        // First Certificate then clean the academic card so that it doesnot conatins any previous data
        this._pdfService.academicCard = {};
      }
      this._pdfService.academicCard[index] = [ 
        [ certificate, '', rollNum, ''],
        ...this.summaryReport
      ];
      resolve(this.summaryReport);
    });
  }

}
