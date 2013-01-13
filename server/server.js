// Just a basic server setup for this site
var Stack = require('stack'),
    Http = require('http');

var port = process.env.PORT || 5000;

Http.createServer(Stack(
  require('wheat')(__dirname+"/..")
)).listen(port);
