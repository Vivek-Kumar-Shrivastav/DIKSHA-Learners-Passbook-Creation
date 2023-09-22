import { Injectable } from '@angular/core';
import { Credentials } from '../../HelperInterfaces/Credendials';
import { ExtractUserDetailService } from './extract-user-detail.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { SummariserService } from '../home/dlp/summariser/summariser.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class DownloadAsPdfService {

  constructor(
    private _extractUserDetail: ExtractUserDetailService,
    private _summariser: SummariserService,
  ) { 
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.user =  {  name : "", dob : "", fatherName : "", motherName : "", gender : "" };
  }

    private dataURL : string = '';
    private user : Credentials ;
    private report: string[][][] = [[[]]];
     
    private ReportCard : string[][][] = [[[]]];
    private numberOfReports = this.ReportCard.length;

    async getSummary() {
      this.report=  await this._summariser.getSummary();
      console.log(`report : ${this.report[0][0][0]}`)
      this.numberOfReports = this.report.length;

      for(let i= 0; i < this.report.length; i++){
        for(let j=0; j < this.report[i].length; j++){
          for(let k=0; k < this.report[i][j].length; k++)
              this.ReportCard[i][j][k] =  this.report[i][j][k];
        }
      }
    }
    
    async  designPdf(contacts : any , phone :"+91 7894676716"){
      return new Promise(async (resolve) =>{
        let docDefinition = {
          content: [
            { text: this.user.name, fontSize: 16, alignment: 'center' },
            { 
              columns : contacts.
              map((contact) =>({
                  text : contact,
                  width : '*',
                  margin :[0,5]
              }))
            },

            {
              table : {
                widths : ['*','*', 'auto'],
                heights : [20, 20, 20, 20,20],
                body : [
                    [{ text : `Name `}, { text : `${ this.user.name}`}, {
                      image : await this.getDataURL('../assets/images/tri-color-bg.png'),
                      width : 90,
                      height : 100,
                      rowSpan : 4,
                    }],
                    [{ text : `DoB `}, { text : `${this.user.dob}`}, ''],
                    [{ text : `Son/Wife/Daughter of `}, { text :  `${ this.user.fatherName}`}, ''],
                    [{ text : `Gender `}, { text : `${this.user.gender}`}, ''],
                ]
              }
            },
           {
              text : "Digital Learners Passbook",
              fontSize :  14,
              decoration : 'underline',
              alignment : 'center',
              margin :[0, 15]
           },

           // Major Part
           {
            table : {
              widths : ['*', '*', '*'],
              body : [`${this.ReportCard?.at(0)?.at(0)}`, `${this.ReportCard?.at(0)?.at(1)}`],
              fontSize : 14,
              margin : [0 , 15]
            // layout: 'noBorders', // Optional: Remove cell borders
            },
           }
          ]
        };
        resolve(docDefinition);
      })
    }
    
    getDataURL(path : string) : Promise<string>{
      return new Promise((resolve)=>{
        let img = new Image();
        img.onload = function() {
          var canvas = document.createElement('canvas');
          canvas.width =  img.width;
          canvas.height =  img.height;
          let ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          let dataURL = canvas.toDataURL(); // Get the data URL
          resolve(dataURL); // Display the data URL in the console
        };
        img.src = path; 
      })
    }

    generateContact(contacts : any){
      let contactList : any = [];
      return new Promise((resolve)=>{
        for(let contact in contacts){
          if (contacts.hasOwnProperty(contact)) {
            const value = contacts[contact];
            const textElement = {
              text: `• ${contact}`,
              link: value,
              decoration : '',
              color : 'blue',
              margin: [0, 5], // Optional margin
            };
            contactList.push(textElement);
          }
        }
        resolve(contactList);
      })
    }
  
    async generatePDF() {
      this.user =  await this._extractUserDetail.getDetails();
      let contacts = await this.generateContact({
        "Gmail" : "viveksrivastav1998vns@gmail.com",
        "GitHub" : "https://github.com/Vivek-Kumar-Shrivastav",
        "LinkedIn" : "https://www.linkedin.com/in/vivek-kumar-shrivastav/",
      });
      this.getSummary();

      let docDefinition = await this.designPdf( 
        contacts,
        "+91 7894676716"
        );
      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.download('my-document.pdf');
    } 
}
