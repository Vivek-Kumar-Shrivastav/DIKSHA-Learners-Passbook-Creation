import { Component, Input } from '@angular/core';


interface Subjects {
  name: string;
  marksObtained: number;
  totalMarks: number;
  strength: string; // Assuming strength is a string, you can adjust the type as needed
};
interface Aggregate {
  obtained: number;
  max: number;
  strength: string; // Assuming strength is a string, you can adjust the type as needed
}

interface Schema {
  array: Subjects[];
  aggregate: Aggregate;
}


/*

summaryReport : Object = {key (subCategory) : value (Schema)}
summaryReport = {
  /*
    subjectCategory1 :[ {
          name : name,
          marksObtained : marksObtained,
          total : totalMarks,
          strength : use marksObtained and totalMarks to classify
      },{
          name : name,
          marksObtained : marksObtained,
          total : totalMarks,
          strength : use marksObtained and totalMarks to classify
      }
    ],
    {
         currObt  : currObt + marksObtained,
         currMax : currMax + totalmarks,
         strength : use currObt and currMax to classify
    },

      subjectCategory2 :[ {
          name : name,
          marksObtained : marksObtained,
          total : totalMarks,
          strength : use marksObtained and totalMarks to classify
      },
      {
          currObt  : currObt + marksObtained,
          currMax : currMax + totalmarks,
          strength : use currObt and currMax to classify
      }],
   ]
  
  */

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class processingComponent {

    @Input() certificate;
    @Input() subjects;
    @Input() uri;
    @Input() rollNumber;

allSubjects = {
    math : ["math"],
    science : ["bio", "chemi", "physic", "science"],
    commerce : ["accountancy", "business", "economics"],
    social_science : ["social studies", "history", "geography", "civics", "economics", "polit"],
    skill_subject : ["information","legal","fashion","mass","entrepreneurship","agriculture","engineering","fine","yoga"],
    language : ["english", "hindi", "urdu", "sanskrit", "punjabi", "bengali", "tamil", "telugu", "sindhi", "marathi", "gujarati", "manipuri", "malayalam", "odia", "assamese", "kannada", "arabic", "tibetan", "french", "german", "russian", "persian", "nepali", "limboo", "lepcha", "telugu telangana", "bodo", "tangkhul", "japanese", "bhutia", "spanish", "kashmiri", "mizo", "bahasa melayu"]
};

summaryReport : Object = {}; 
strength :Object = {
    9 : "phenomenal",
    8 : "excellent",
    7: "good",
    6 : "hardWorking",
 "other" : "persevering"
}

giveStrength(marksObtained : number, totalMarks : number){
  let calaulatedStrength = "persevering";
  let percentage = `${Math.floor((marksObtained*1)/(totalMarks*1))}`;
  if(this.strength.hasOwnProperty(percentage)){
    calaulatedStrength = this.strength[percentage];
  }
  return calaulatedStrength;
}
async process(){
  let a =  {} as Schema;
  
  /*
    Subject{
    name : string;
    marksObtained : string; 
    totalMarks : string;    
    gp : string;}
    */
    for( let subjectCategory in this.allSubjects ){
      // subjectCategory is an array
      let array : Array<Subjects> = [];
      let aggregator  : Aggregate = { obtained : 0, max : 0, strength : "persevering" };
      let categoryReport : Schema = { array : array, aggregate : aggregator};
     for( let subject of subjectCategory){
       for(let currentSubject of this.subjects)
       {
          let name : string = currentSubject.name;
          let marksObtained :number = currentSubject.marksObtained * 1;
          let totalMarks : number = currentSubject.totalMarks *1;
          let contains : boolean = name.toLowerCase().includes(subject);
          if(contains == true){
             let calaulatedStrength :string = this.giveStrength(marksObtained, totalMarks);
             let subject : Subjects = {name: name, marksObtained: marksObtained ,totalMarks: totalMarks,strength: calaulatedStrength};
 
             aggregator.obtained += marksObtained;
             aggregator.max += totalMarks;
             aggregator.strength = this.giveStrength(aggregator.obtained,  aggregator.max);
             array.push(subject);
             break;
           }
        }
 
     this.summaryReport[subjectCategory] = categoryReport;
   }
 }

  //   for(let subject of this.subjects)
  //   {
  //      let name = subject.name;
  //      let marksObtained = subject.marksObtained * 1;
  //      let totalMarks = subject.totalMarks *1;

  //     for( let subjectCategory in this.allSubjects ){
  //        // subjectCategory is an array
  //        let array : Array<Subjects> = [];
  //        let aggregator  : Aggregate = { obtained : 0, max : 0, strength : "persevering" };
  //        let categoryReport : Schema = { array : array, aggregate : aggregator};
  //       for( let subject of subjectCategory){
  //         let contains = name.toLowerCase().includes(subject);
  //         if(contains == true){
  //             let calaulatedStrength = this.giveStrength(marksObtained, totalMarks);
            
  //             let subject : Subjects = {name: name, marksObtained: marksObtained ,totalMarks: totalMarks,strength: calaulatedStrength};
  //             aggregator.obtained += marksObtained;
  //             aggregator.max += totalMarks;
  //             aggregator.strength = this.giveStrength(aggregator.obtained,  aggregator.max);
  //             array.push(subject);
  //         }
  //       }

  //       this.summaryReport[subjectCategory] = categoryReport;
  //   }
  // }

  }
}

// for( let subjectCategory in this.allSubjects ){
//      // subjectCategory is an array
//      let array : Array<Subjects> = [];
//      let aggregator  : Aggregate = { obtained : 0, max : 0, strength : "persevering" };
//      let categoryReport : Schema = { array : array, aggregate : aggregator};
//     for( let subject of subjectCategory){
//       for(let currentSubject of this.subjects)
//       {
//          let name : string = currentSubject.name;
//          let marksObtained :number = currentSubject.marksObtained * 1;
//          let totalMarks : number = currentSubject.totalMarks *1;
//          let contains : boolean = name.toLowerCase().includes(subject);
//          if(contains == true){
//             let calaulatedStrength :string = this.giveStrength(marksObtained, totalMarks);
//             let subject : Subjects = {name: name, marksObtained: marksObtained ,totalMarks: totalMarks,strength: calaulatedStrength};

//             aggregator.obtained += marksObtained;
//             aggregator.max += totalMarks;
//             aggregator.strength = this.giveStrength(aggregator.obtained,  aggregator.max);
//             array.push(subject);
//             break;
//           }
//        }

//     this.summaryReport[subjectCategory] = categoryReport;
//   }
// }
// itr trgh all sub and if current-sub is same as the name add that subject.
// 1st element : adding the subject means : add Original name, marksObtained, total marks, 
// and based on that classify a strength level

// 2nd element : also, currObt, currMax, aggregated  strength level.