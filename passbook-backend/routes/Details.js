import express from "express";
import axios from "axios";
const router = express.Router();

router.get("/", async (req, res) => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/user',
      headers: { 
        'Authorization': `Bearer ${req.query.token}`
      }
    };
    console.log("Config:", config);
  
    axios.request(config)
    .then((response) => {
      // console.log("Users :", JSON.stringify(response.data));
      res.send(response.data)
    })
    .catch((error) => {
      res.send(`Error : ${error}`);
    });
  
  })

export default router;
