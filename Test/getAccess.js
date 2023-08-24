const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://digilocker.meripehchaan.gov.in/public/oauth2/2/authorize?response_type=code&client_id=YM09DB6624&redirect_uri=https://google.com&state=Testing&code_challenge=CBUw14zO94M8trTZzPE99ZAvb3N0bRsfy_6vbDcba0c&code_challenge_method=S256',
};

axios.request(config, (req, res)=>{
  
})
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
