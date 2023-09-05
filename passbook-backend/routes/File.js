import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/", async (req, res) => {
 
    console.log("/inside/api/file");
    
    /*Cut-pdf-config*/
  
    //Comment-1
    let config ={
      method : 'get',
      maxBodyLength: Infinity,
      url: `https://digilocker.meripehchaan.gov.in/public/oauth2/1/xml/${req.body.uri}`,
      headers: {
       'Authorization': `Bearer ${req.body.token}`,
        mode : 'no-cors'
      },
    }
    console.log("Fetching axios");
    axios(config).then(
      (xml)=>{
        console.log(`uri : ${req.body.uri}`);
        res.send(xml.data) ;
      },
      (error)=>{
            console.log(`uri : ${req.body.uri}`);
            console.log(`Error in /api/file : ${error}`);
            res.send("no-xml");
          }
    );
      console.log("response sent");
    // Cut-1
  
  });

export default router;