import express from "express";
import axios from "axios";
import dotenv from "dotenv"
dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
    //  res.json({code : "45895f66133964f3aa15daf71cc9802abd4817f4"});

  const tokenEndpoint = "https://digilocker.meripehchaan.gov.in/public/oauth2/2/token";
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const authCode = req.body.code;
  console.log("Authcode", authCode);
  console.log(`Authcode: ${authCode}`);
  const redirectUri = "http://localhost:4200/DLP";
  
  const codeVerifier = process.env.CODE_VERIFIER;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");  

  const data = new URLSearchParams();
  
  data.append('grant_type', 'authorization_code');
  data.append("code", authCode);
  data.append("client_id", clientId);
  data.append("client_secret", clientSecret);
  data.append("redirect_uri", redirectUri);
  data.append("code_verifier", codeVerifier);
  

  // console.log("Token Body :", req.body);
  
  axios.post(tokenEndpoint, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${credentials}`,
      },
    })
    .then((response) => {
      // console.log("Access Token:", response.data.access_token);
      // console.log("Token Type:", response.data.token_type);
      // console.log("Expires In:", response.data.expires_in);
      // console.log("ID-Token:", response.id_token);
      console.log('Token : ', response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.error("Error in accessing Token:", error.response.data);
    });

  });

export default router;
