const express = require('express');
const cors = require('cors');  // Allows a server to indivate any origins https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
const cookieParser = require('cookie-parser'); // cookie-parser module, install using npm?

const app = express();
const PORT = process.env.PORT;

// Get templates folder path
const path = require('path');
const html_dir = path.join(__dirname ,'/templates/');

// Designate the static folder as serving static resources
app.use(express.static(__dirname + '/static'))
    .use(cors()) // added usage of cors
    .use(cookieParser()); // added usage of cookieParser
app.use(express.urlencoded({extended: true}));


/*****************\
* FRONTEND ROUTES *
\*****************/
app.get('/', (req, res) => {
  res.sendFile(`${html_dir}login.html`);
});

app.get('/home', (req, res) => {
  res.sendFile(`${html_dir}homepage.html`);
});

app.get('/about', (req, res) => {
  res.sendFile(`${html_dir}about.html`);
});

app.get('/contact', (req, res) => {
  res.sendFile(`${html_dir}contact.html`);
});

app.get('/logout', (req, res) => {
  res.sendFile(`${html_dir}logout.html`);
});



// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));