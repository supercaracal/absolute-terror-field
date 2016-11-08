var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app);

server.listen(process.env.PORT || 8080);

app.get('/', function(req, res) {
  res.header('Cache-Control', 'public, max-age=1800');
  res.sendFile(__dirname + '/index.html');
});

app.get('/*', function(req, res) {
  res.header('Cache-Control', 'public, max-age=1800');
  res.sendFile(__dirname + req.url);
});
