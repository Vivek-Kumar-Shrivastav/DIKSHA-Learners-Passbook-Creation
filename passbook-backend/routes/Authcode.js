import express from "express"
import axios from "axios";
const router = express.Router();

router.get("/", async (req, res) => {
  
    const auth = await axios.get(
        "https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize",
        {
          params:
          {
            redirect_uri: "http://localhost:4200/DLP",
            client_id: "NQ44FD04AE",
            response_type: "code",
            state: "Testing",
            code_challenge: "CBUw14zO94M8trTZzPE99ZAvb3N0bRsfy_6vbDcba0c",
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
