import express from "express"
import axios from "axios";
import dotenv from "dotenv"
dotenv.config();
const router = express.Router();

router.get("/", async (req, res) => {
  
  try{
    const authentication = await axios.get(
        "https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize",
        {
          params:
          {
            redirect_uri: "http://localhost:4200/DLP",
            client_id: process.env.CLIENT_ID,
            response_type: "code",
            state: "Testing",
            code_challenge: process.env.CODE_CHALLENGE,
            code_challenge_method: "S256",
            // scope : "openid"
          },
        }
      );

      const url = authentication.request.res.responseUrl;
      console.log("Fetched Url");
      console.log(`URL ; ${url}`);
      res.json({url : url});
    }
    catch (error){
      console.log("Error in getting code");
    }
});

export default router;
