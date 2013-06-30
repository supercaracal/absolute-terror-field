var express = require('express')
  , http = require('http');
var app = express();
var server = http.createServer(app);
server.listen(process.env.PORT || 8080);
app.get('/', function(req, res) {
    res.header('Cache-Control', 'public, max-age=1800');
    res.sendfile(__dirname + '/index.html');
});
app.get('/*', function(req, res) {
    res.header('Cache-Control', 'public, max-age=1800');
    res.sendfile(__dirname + req.url);
});
