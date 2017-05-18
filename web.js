const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

server.listen(process.env.PORT || 8080);

app.get('/', (req, res) => {
  res.header('Cache-Control', 'public, max-age=1800');
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/absolute-terror-field/:file_name', (req, res) => {
  res.header('Cache-Control', 'public, max-age=1800');
  res.sendFile(path.join(__dirname, '/', req.params.file_name));
});
