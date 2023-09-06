import express from "express";
import axios from "axios";
import fs from "fs";
const router = express.Router();

router.post("/", async (req, res) => {
 
    console.log("/inside/api/file");
    let xml = "";

    let configXml ={
      method : 'get',
      maxBodyLength: Infinity,
      url: `https://digilocker.meripehchaan.gov.in/public/oauth2/1/xml/${req.body.uri}`,
      headers: {
       'Authorization': `Bearer ${req.body.token}`,
        mode : 'no-cors'
      },
    }
   
    console.log("Fetching axios");

    try{
     
      xml = await axios(configXml)
      
      console.log(`uri : ${req.body.uri} and xml is : ${xml.data}`);

      res.send({xml : `${xml.data}`}) ;
    }
    catch(error){
      console.log(`uri : ${req.body.uri}`);
      console.log(`Error in /api/file : ${error}`);
      xml = `<?xml version="1.0" encoding="UTF-8" ?><NoXml>No XML</NoXml>`;
      res.send({xml : xml});
    }
    
      console.log("response sent");
  });
 
  
export default router;