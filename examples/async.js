'use strict';
var fs = require('fs')
  , err
  , files
  , timeoutRes;

setTimeout(function () {
  timeoutRes = 'timed out';
  console.log(timeoutRes);
  secondTimeout();
}, 500);

fs.readdir(__dirname, function (err_, entries) {
  err = err_;
  files = entries;
  console.log('err: %s, files %s', err, files);
});

function secondTimeout() {
  setTimeout(function () {
    timeoutRes = 'timed out again';
    console.log(timeoutRes);
  }, 500);
}
