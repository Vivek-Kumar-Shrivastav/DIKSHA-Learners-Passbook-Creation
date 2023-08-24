import { Injectable } from '@angular/core';
import { Subject, Subjects } from '../home/HelperInterfaces/CertificateData';

@Injectable({
  providedIn: 'root'
})
export class CertificateDataService {
 
  subjects : any;
  certificates: Subjects;
  constructor() { 
    this.certificates = { subjects: [], certificateOf: '' };
  }

  getData(xmlDoc :Document){
    let newCertificates : Subjects = Object.assign({}, this.certificates);
    newCertificates.certificateOf = xmlDoc
    ?.getElementsByTagName('Certificate')[0]
    ?.getAttribute('name')!;

    // Data-Cleaning or Data-Preprocessing
    this.subjects = Array.from(xmlDoc?.getElementsByTagName('Subject'));
    this.subjects = this.subjects.filter(
      (subject) => subject?.getAttribute('name') != ''
    );
    
    // Data-Extraction
    let sub: Subject = { name: '', marks: '' , gp: '' };
    
    newCertificates.subjects = this.subjects.map((subject) => {
      let newSub = Object.assign({}, sub);
      newSub.name = subject?.getAttribute('name');
      let theoryMarks = +subject?.getAttribute('marksTheory');
      let practicalMarks = +subject?.getAttribute('marksPractical');
      let totalMarksObtained = theoryMarks + practicalMarks;
      let marksMaxTheory = +subject?.getAttribute('marksMaxTheory');
      let marksMaxPractical = +subject?.getAttribute('marksMaxPractical');
      let marksTotal = marksMaxPractical + marksMaxTheory;
      if(marksTotal ==0) marksTotal = 100;
      // newSub.marks  = `${Math.floor(totalMarksObtained/marksTotal *100)}`;
      newSub.marks  = `${totalMarksObtained}/${marksTotal }`;
      newSub.gp = subject?.getAttribute('gp');
      if(newSub.gp !== ''){
        newSub.marks = '';
      }
      console.log(subject);
      return newSub;
    });
    return newCertificates;
  }
}
