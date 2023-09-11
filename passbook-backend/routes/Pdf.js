import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/", async(req, res)=>{
  
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      // url : `https://pdfobject.com/pdf/sample.pdf`, 
      url: `https://digilocker.meripehchaan.gov.in/public/oauth2/1/file/${req.body.uri}`,
      headers: { 
        'Authorization': `Bearer ${req.body.token}`,
         Accept : 'application/pdf',
        'Content-Type': 'application/pdf',
         mode : 'no-cors'
      },
      responseType : "arraybuffer",
    };
  
    axios(config)
    .then((pdf)=>
    {  
        //  console.log(`............................GOT PDF  ${pdf.data}`);
         res.send(pdf.data);
    },(error)=>{
      console.log(`Error : ${error}`);
      console.log(`Pdf : ${req.body.uri}`);
    });
  })
  
export default router;
