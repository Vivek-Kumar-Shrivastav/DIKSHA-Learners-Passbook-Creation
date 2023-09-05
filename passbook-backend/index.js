// const express = require("express");
import express       from "express"
import bodyParser    from "body-parser"
import cors          from 'cors'
import authcoderoute from "./routes/Authcode.js"
import tokenroute    from "./routes/Token.js"
import detailsroute  from "./routes/Details.js"
import filesroute    from "./routes/Files.js"
import fileroute     from "./routes/File.js"
import pdfroute      from "./routes/Pdf.js"

const app = express();
const PORT = "5000";

app.use(bodyParser.json());
app.use(cors());

// const port2 = "4200";

var whitelist = ['http://localhost:4200']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
//Authentication code Route
app.use("/api/authorise", authcoderoute);
//Token Route
app.use("/api/token", tokenroute);
//User Detail Route
app.use("/api/details", detailsroute);
//All Files Route
app.use("/api/files", filesroute);
//Individual FileRoute
app.use("/api/file", fileroute);
//Getting File as Pdf Route
app.use("/api/pdf", pdfroute);

app.listen(PORT, () => {
  console.log("App is listening on PORT", PORT);
});

// Cut-1

//  await axios(configPdf)
  // .then((resp)=>
  // {   pdf = resp.data;
  //      console.log(`............................GOT PDF  ${pdf}: ${count}`);
  //      res.send([pdf, xml]);
  //      let fileType  = `${resp}`.split(";")[0];
  //     /*
  //       let render = "blob";
  //       if(fileType == "data:application/pdf"){
  //         render = "base64";
  //         console.log(`Type : ${render} `);
  //       }
  //       else{
  //           console.log(`Type : ${render} `)
  //       }
  //       console.log(resp.headers);
  //       var file = new Blob([resp.data], {type: 'application/pdf'}); 
  //     */
  //     // res.send(resp.data);
  // },(error)=>{
  //     console.log(`Error : ${error}`);
  // });

  // console.log(`...................response not sent : : ${count}`);
  // count++;
  // XML

  // await axios(configXml)
  // .then((resp)=>{
  //     xml  = resp.data;
  //     console.log(`..................GOT XML : ${xml} : ${count}`);
  //   },(error)=>{
  //     console.log(`Error : ${error}`);
  //   });
      

  /*Cut-pdf-config*/

   // let config = {
  //   method: 'get',
  //   maxBodyLength: Infinity,
  //   url : `https://pdfobject.com/pdf/sample.pdf`, 
  //   url: `https://digilocker.meripehchaan.gov.in/public/oauth2/1/file/${req.body.uri}`,
  //   headers: { 
  //     'Authorization': `Bearer ${req.body.token}`,
  //      Accept : 'application/pdf',
  //     'Content-Type': 'application/pdf',
  //      mode : 'no-cors'
  //   },
  //   responseType : "arraybuffer",
  // };
  // console.log(config)