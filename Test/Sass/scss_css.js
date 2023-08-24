const sass = require('sass');
const fs = require('fs').promises;
const path = require('path');

const output = sass.compile("input.scss");
console.log(output.css);
fs.writeFile(path.join(__dirname, "output.css"), `${output}`, {flag: "a"});

const compressed = sass.compile("input.scss", {style: "compressed"});
console.log(compressed.css);