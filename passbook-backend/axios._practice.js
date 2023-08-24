const express = require('express');
const axios = require("axios");

async function getReq(){
    const auth = await axios.get(
        "https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize",
        {
          params: 
          {
            redirect_uri: "http://localhost:4200/DLP",
            client_id: "NQ44FD04AE",
            response_type: "code",
            state: "Testing",
            code_challenge: "CBUW142094MBtnTZZPE99ZAvb3N0bRsfy_6vbDcba8c",
            code_challenge_method: "S256",
          },
        }
      );  
      
      // const data = auth;
      console.log(auth.request.res.responseUrl);
      console.log("Fetched")
}

getReq();