import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/", async (req, res) => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/files/issued',
      headers: { 
        'Authorization': `Bearer ${req.body.token}` 
      }
    };
    
    axios.request(config)
    .then((response) => {
      console.log("Files :", JSON.stringify(response.data));
      res.send(response.data)
    })
    .catch((error) => {
      // console.log(error);
      res.send(`Error : ${error}`);
    });
    
  })

export default router;

