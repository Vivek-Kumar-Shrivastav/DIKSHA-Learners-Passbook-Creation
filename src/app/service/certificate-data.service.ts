import { Injectable } from '@angular/core';
import { Subject, Subjects } from '../home/HelperInterfaces/CertificateData';

@Injectable({
  providedIn: 'root'
})
export class CertificateDataService {
  subjects : any;
  certificates: Subjects;
  constructor() { 

    //Try to use constructor of Subject interface to initialize this.certificate
    this.certificates = {subjects : [], uri :'', certificateOf: '',};
  }

  getData(certificate : any){   // declare the type of certificate 
    let newCertificates : Subjects = Object.assign({}, this.certificates);
    
    // certificateOf
    newCertificates.certificateOf = certificate.xml   
    ?.getElementsByTagName('Certificate')[0]
    ?.getAttribute('name')!;

    // URI
    newCertificates.uri = certificate.uri;  //blob
    // window.open(certificate.pdf, '_blank');

    // Data-Cleaning or Data-Preprocessing
    this.subjects = Array.from(certificate.xml?.getElementsByTagName('Subject'));
    if(this.subjects.length == 0){
      return newCertificates;  // blank or only uri.
    }
    
    // Removing any blank Entry
    this.subjects = this.subjects.filter(
      (subject) => subject.getAttribute('name') != ''
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
