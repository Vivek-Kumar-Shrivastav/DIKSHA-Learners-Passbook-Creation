const pdfjsLib = require('pdfjs-dist');
const xmljs = require('xml-js');
const fs = require('fs').promises;
const path = require('path');


// async function getText(){
// const pdf  = await pdfdist.getDocument(url).promise;
// // for(let pageNum=1; pageNum <= pdf.length; pageNum++){
//     let page  = await pdf.getPage(1);
//     let textContent  = await page.getTextContent();
//     let arr = [];
//     textContent.items.forEach((item) => {
//         if (item instanceof Object && 'str' in item) {
//                 arr.push(item.str);
//         }
//       });
//     //arr = arr.filter(str => str != " ")
//     console.log(arr);
// // }

// // console.log(pdf)
// }

async function extractTextFromPdf(pdfData) {
    const pdf = await pdfjsLib.getDocument(pdfData).promise;
    const textItems = await getTextFromPages(pdf);
    return textItems.join('\n');
}

async function getTextFromPages(pdf){
        const textItems = [];
        for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
          const page = await pdf.getPage(pageIndex);
          const textContent = await page.getTextContent();
  
          textContent.items.forEach((item) => {
            if (item instanceof Object && 'str' in item) {
              textItems.push(item.str);
            }
          });
        }
        return textItems;
}

function convertToXML(pdfText) {
    const paragraphs = pdfText.split('\n');

    const xmlData = {
      elements: [
        {
          type: 'element',
          name: 'document',
          elements: paragraphs.map(paragraph => ({
            type: 'element',
            name: 'paragraph',
            elements: [
              {
                type: 'text',
                text: paragraph
              }]

}))
        }
    ]
};

const xmlOptions = {
    spaces: 2,
    compact: true
  };

  const xmlDocument = xmljs.js2xml(xmlData, xmlOptions);

  return xmlDocument;
}

let url  = 'file:///C:/Users/vivek/Downloads/in.gov.cbse-SSCER-51171332015%20(1).pdf';

async function getText(url){
  let pdfText = await extractTextFromPdf(url);
  fs.writeFile(path.join(__dirname, "output.xml"), `${await convertToXML(pdfText)}`, {flag: "w"});
   
}
getText(url); 

