'use strict';

var http         =  require('http')
  , ecstatic     =  require('ecstatic')
  , build        =  require('./build')
  , staticServer =  ecstatic({ root: __dirname, autoIndex: true })
  , path         =  require('path')
  , tests;

var argv_ = process.argv.slice(2);
if (argv_.length) tests = argv_.map(path.resolve.bind(null, process.cwd()));

http.createServer(function (req, res) {
  return req.url === '/bundle.js' ? serveBundle(req, res) : staticServer(req, res);
}).listen(3000);
console.log('Listening: http://localhost:3000');

function serveBundle(req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  build(tests).pipe(res);
}
