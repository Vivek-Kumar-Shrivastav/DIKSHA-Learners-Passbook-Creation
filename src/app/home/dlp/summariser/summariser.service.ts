import { Injectable } from '@angular/core';
import { Subject } from '../../../../HelperInterfaces/CertificateData'
import { SubjectPerformanceCard } from 'src/HelperInterfaces/SubjectPerformanceCard';
import { CategoryPerformanceCard } from 'src/HelperInterfaces/CategoryPerformanceCard';
import { PerformanceCard } from 'src/HelperInterfaces/PerformanceCard';
import { retry } from 'rxjs';

@Injectable()

export class SummariserService {
  constructor() { }

  // Final Report Card
  private summaryReport: string[][] = [[]];
  private ReportCard :string[][][]= [[[]]];
  // Category wise subjects List
  private schoolSubjects = {
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

  //Competency Level
  private strength: Object = {
    10: 'Exceptional',
    9: 'phenomenal',
    8: 'excellent',
    7: 'good',
    6: 'hardWorking',
    other: 'persevering',
  };

  // Caculates the competency of student in given subject/category
  private giveStrength(marksObtained: number, totalMarks: number): Promise<string> {
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
  async summarise(subjects: Subject[]) : Promise<Array<Array<string>>> {
    return new Promise(async (resolve, reject) => {
      let category: number = 0;
      for (let subjectCategory in this.schoolSubjects) {
        
        // subjectsPerformance is an array of subjectsPerformanceCard
        let subjectsPerformance: SubjectPerformanceCard[] = [];
        let categoryPerformance: CategoryPerformanceCard = {
          obtained: 0,
          max: 0,
          strength: 'persevering',
        };
  
        let categoryReport: PerformanceCard = { subjectsPerformanceCard: subjectsPerformance, categoryPerformanceCard: categoryPerformance };
  
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
  
              // let individualReport = `Student has obtained ${categoryPerformance.obtained} marks out of ${categoryPerformance.max} and shown ${categoryPerformance.strength} nature in field of ${subjectCategory}`;
              // this.summaryReport[category++] = [subject.name, `${subject.marksObtained}`, `${subject.totalMarks}`, `${subject.strength}`];
  
              categoryPerformance.obtained += marksObtained;
              categoryPerformance.max += totalMarks;
              categoryPerformance.strength = await this.giveStrength(
                categoryPerformance.obtained,
                categoryPerformance.max
              );
              break;
            }
          }
          // O : category, 1..n-2 : SubjectPerformanceCard, n-1: CategoryPerformanceCard
          //This eliminates the category(s) which is(are) not in the Certificate
        }
        
        //Check if any subject falls into current CategoryPerformanceCard of SubjectPerformanceCard
        if (categoryReport.categoryPerformanceCard.obtained != 0) {
          // let finalReport = `Student has obtained ${categoryPerformance.obtained} marks out of ${categoryPerformance.max} and shown ${categoryPerformance.strength} nature in field of ${subjectCategory}`;
          this.summaryReport[category++] = [
             subjectCategory,
            `${categoryPerformance.obtained}`,
            `${categoryPerformance.max}`,
            `${categoryPerformance.strength}`,
          ];
        }
      }
      // return this.summaryReport;
      this.ReportCard.push(this.summaryReport);
      resolve(this.summaryReport);
    })
  }

  // Returns the summary 
  getSummary(): Promise<string[][][]>{
    return new Promise((resolve) => {
      if(this.summaryReport[0][0] != undefined)
      resolve(this.ReportCard);
    })
  }
}
