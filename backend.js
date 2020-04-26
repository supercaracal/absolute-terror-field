const express = require('express');
const http = require('http');
const path = require('path');

const DEFAULT_PORT = 3000
const CACHE_MAX_AGE_SEC = 1800

const app = express();
const server = http.createServer(app);

server.listen(process.env.PORT || DEFAULT_PORT);

app.get('/', (req, res) => {
  res.header('Cache-Control', `public, max-age=${CACHE_MAX_AGE_SEC}`);
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/:file_name', (req, res) => {
  res.header('Cache-Control', `public, max-age=${CACHE_MAX_AGE_SEC}`);
  res.sendFile(path.join(__dirname, '/', req.params.file_name));
});
