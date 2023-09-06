import express from "express"
import axios from "axios";
import dotenv from "dotenv"
dotenv.config();
const router = express.Router();

router.get("/", async (req, res) => {
  
    const auth = await axios.get(
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

      const url = auth.request.res.responseUrl;
      // console.log(auth.request.res.responseUrl);
      console.log("Fetched Url");
      // console.log(url);
      res.json({url : url});
});

export default router;
