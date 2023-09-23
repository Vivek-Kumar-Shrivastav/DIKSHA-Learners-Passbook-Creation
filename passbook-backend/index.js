// const express = require("express");
import express       from "express"
import bodyParser    from "body-parser"
import cors          from 'cors'
import authcoderoute from "./routes/Authcode.js"
import tokenroute    from "./routes/Token.js"
import detailsroute  from "./routes/Details.js"
import filesroute    from "./routes/Files.js"
import fileroute     from "./routes/File.js"
import pdfroute      from "./routes/Pdf.js"

const app = express();
const PORT = "5000";

app.use(bodyParser.json());
app.use(cors());


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

//Authentication Code Route
app.use("/api/authorise", authcoderoute);
//Token Route
app.use("/api/token", tokenroute);
//User Detail Route
app.use("/api/details", detailsroute);
//All Files Route
app.use("/api/files", filesroute);
//Individual FileRoute
app.use("/api/file", fileroute);
//Getting File as Pdf Route
app.use("/api/pdf", pdfroute);

app.listen(PORT, () => {
  console.log("App is listening on PORT", PORT);
});

