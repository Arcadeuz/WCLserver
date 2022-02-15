const express = require('express');
const app = express();
const path = require('path');

//const port = process.env.PORT || 8080;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
