 const express = require("express");
const axios = require("axios");
const bodyParser = require('body-parser')
const app = express();   
const dlpApp = express();  

app.use(bodyParser.json());
const cors = require('cors');
const port1 = "5000";
// const port2 = "4200";

var whitelist = ['http://localhost:4200']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

//Auth-code-generation
let authCode ="";

// dlpApp.get("/DLP", (req, res)=>{
//      res.status  = 200;
//      console.log("Inside DLP: ", req.query?.code);
//      authCode = req.query?.code;
//      res.send(req.query?.code);
// })

app.get("/api/authorise", async (req, res) => {
  
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
      console.log("Fetched Url")

      // console.log(req)
      // console.log(url);
      res.json({url : url});
});

// Token-access

app.post("/api/token", async (req, res) => {
    //  res.json({code : "45895f66133964f3aa15daf71cc9802abd4817f4"});

  const tokenEndpoint = "https://digilocker.meripehchaan.gov.in/public/oauth2/2/token";
  const clientId = "NQ44FD04AE";
  const clientSecret = "0d577d436ac1c0877743";
  const authCode = req.body.code;
  console.log(`Authcode: ${authCode}`);
  const redirectUri = "http://localhost:4200/DLP";
  
  const codeVerifier = "ANXS4OMH4MRU2SY5YP2XETL52ILM390HAU6W9ABWV64";
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
      console.log("Access Token:", response.data.access_token);
      console.log("Token Type:", response.data.token_type);
      console.log("Expires In:", response.data.expires_in);
      console.log("ID-Token:", response.id_token);
      res.json(response.data);
    })
    .catch((error) => {
      console.error("Error:", error.response.data);
    });

  });
 

app.get("/api/details", async (req, res) => {
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

app.get("/api/files", async (req, res) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/files/issued',
    headers: { 
      'Authorization': `Bearer ${req.query.token}` 
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

app.get("/api/file", async (req, res) => {

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://digilocker.meripehchaan.gov.in/public/oauth2/1/xml/${req.query.uri}`,

      //   https://digilocker.meripehchaan.gov.in/public/oauth2/1/file/uri

      headers: { 
        'Authorization': `Bearer ${req.query.token}` 
      }
    };
    
    axios.request(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      console.log(response.data);
      res.send(response.data)
    })
    .catch((error) => {
      // console.log(error);
      res.send(`Error : ${error}`);
    });
})

// Listening to port1 
  
app.listen(port1, () => {
  console.log("App is listening on port1", port1);
});


// dlpApp.listen(port2, () => {
//   console.log("App is listening on port2", port2);
// });
