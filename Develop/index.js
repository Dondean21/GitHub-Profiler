const fs = require("fs");
const html = "index.html";
const axios = require("axios");
const pdf = require("html-pdf")
const inquirer = require("inquirer");
const generateHTML = require("./generateHTML");

async function printPDF() {
    var fullHTML = fs.readFileSync('./index.html', 'utf8');
    var options = { format: 'A4' };

    pdf.create(fullHTML, options).toFile('./profile.pdf', function (err, res) {
      if (err) return console.log(err);
      console.log(res)
    })

}

// write html 
function writeToFile(html, data) {
    fs.writeFile(html, data, function(err) {
    if (err) {
        return Error;
    }
  });
}
// append
function appendToFile(html, data) {
  fs.appendFile(html, data, function(err) {
    if (err) {
      return Error; 
    } else {
      printPDF();
    }

  });
  
}

// init for cli 
function init() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "username",
        message: "Enter your GitHub username: "
      },
      {
        type: "list",
        message: "Pick your favorite color out of the following choices:",
        name: "color",
        choices: ["green", "blue", "pink", "red"]
      }
    ])
    .then(function(data) {
      writeToFile(html, generateHTML.generateHTML(data));
      return data;
    })
    .then(function(data) {
      const queryUrl = `https://api.github.com/users/${data.username}`;

      axios.get(queryUrl).then(function(res) {
        appendToFile(html, generateHTML.gitInfo(res));
      });
    });
}

init();