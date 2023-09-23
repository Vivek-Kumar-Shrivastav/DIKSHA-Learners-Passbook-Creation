import { Injectable } from '@angular/core';
import { Credentials } from '../../HelperInterfaces/Credendials';
import { ExtractUserDetailService } from './extract-user-detail.service';
import { UserDataService } from './user-data.service'
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class DownloadAsPdfService {
  docDefinition : any;
  dataURL : string = '../assets/images/tri-color-bg.png';
  academicCard : object =  {};  // In Angular, services are typically singletons i.e. they are created once and shared across application
  private user : Credentials ;

  constructor(
    private _extractUserDetail: ExtractUserDetailService,
    private _userDataService : UserDataService
  ) { 
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.user =  {  name : "", dob : "", fatherName : "", motherName : "", gender : "" };  
  }
  
    async getSummary() {
      return new Promise((resolve) =>{
        for(let key in this.academicCard){
          console.log("Value");
          let tableBody : Array<any> = [];
          let certificateDetails = [
            {text: `${this.academicCard[key][0][0]}`, style: 'tableHeader', colSpan : '2',alignment: 'center'},
            {text: '', style: 'tableHeader',alignment: 'center'},
            {text: 'Roll Number', style: 'tableHeader', alignment: 'center'},
            {text: `${this.academicCard[key][0][2]}`, style: 'tableHeader',alignment: 'center'}
          ];
          tableBody.push(certificateDetails);
          // Header of Table
          let header =  [
            {text: 'Category', style: 'tableHeader',  alignment: 'center'},
            {text: 'Marks Obtained', style: 'tableHeader',alignment: 'center'},
            {text: 'Max Marks', style: 'tableHeader', alignment: 'center'},
            {text: 'Competency', style: 'tableHeader',alignment: 'center'}
          ];
          
          tableBody.push(header);
          for(let i=1; i < this.academicCard[key].length; i++){
              let subject = this.academicCard[key][i];
              let category =  {text: `${subject[0]}`, alignment: 'center'};
              let marksObtained =  {text: `${subject[1]}`, alignment: 'center'};
              let maxMarks =  {text: `${subject[2]}`, alignment: 'center'};
              let competency =  {text: `${subject[3]}`, alignment: 'center'};
             
              tableBody.push([category, marksObtained, maxMarks, competency]);
          }
          let table =  {
            table : {
              widths : ['*', '*', '*', '*'],
              body : tableBody,
              fontSize : 14,
              margin : [ 15, 0, 0, 15]
            // layout: 'noBorders', // Optional: Remove cell borders
            }
           }
           this.docDefinition.content.push(table);
           this.docDefinition.content.push({text : '',  margin :[0,10]});
    
        }
        resolve(1);
      })
    }
    
    async designPdf(contacts : any ){
      return new Promise(async (resolve) =>{
         this.docDefinition = {
          content: [
            { text: this.user.name, fontSize: 16, alignment: 'center' },
            { 
              columns : contacts.map((contact) =>({
                  text : contact,
                  width : '*',
                  margin :[0,5]
              }))
            },

            {
              table : {
                widths : ['*','*', 'auto'],
                heights : [20, 20, 20,20],
                body : [
                    [
                      { text : `Name `}, { text : `${ this.user.name}`},
                      {
                        image : await this.getDataURL(this.dataURL),
                        width : 90,
                        height : 100,
                        rowSpan : 4,
                      }
                    ],
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

          ],
          styles : {
            tableHeader: {
              bold: true,
              fontSize: 13,
              color: 'black'
            }
          }
        }
        resolve(this.docDefinition);
      })
    }
    
    
    getDataURL(imagePath : string) {
      try{
        return new Promise((resolve, reject) => {
        // Create a new Image object
        let img = new Image();
           
        // Define the onload event handler
        img.onload = function() {
          // Create a canvas element with the same dimensions as the image
          var canvas = document.createElement('canvas');
          canvas.width =  img.width;
          canvas.height =  img.height;

           // Get a 2D rendering context for the canvas
          let ctx = canvas.getContext('2d')!;

          // Draw the loaded image onto the canvas at position (0, 0)
          ctx.drawImage(img, 0, 0);

          // Get the data URL of the drawn image
          let dataURL = canvas.toDataURL();
          
          // Resolve the Promise with the generated Data URL
          resolve(dataURL);
        };

        // Define the onerror event handler in case the image fails to load
        img.onerror = function() {
          resolve('../assets/images/tri-color-bg.png'); // Default Path
        };

        // Set the source (path or URL) of the image
        img.src = imagePath;  // Replace 'imagePath' with the actual path or URL of the image
        });
      } catch(err){
          console.log("Error in getting URL");
          return  '../assets/images/tri-color-bg.png';
        }
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

      //Get the URL of uploaded user image
      let URL = this._userDataService.imageUrl;
      if(URL !== ''){
        this.dataURL = URL;
      }

      let docDefinition = await this.designPdf( 
        contacts,
        // "+91 xxxxx76716"
      );

      await this.getSummary();
      const pdfDoc = pdfMake.createPdf(docDefinition);
      try{
        pdfDoc.open();
      }
      catch(err){
        console.log("Error in opening the pdf", err);
      }
    } 
}
