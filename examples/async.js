'use strict';
var fs = require('fs')
  , err
  , files;

fs.readdir(__dirname, function (err_, entries) {
  err = err_;
  files = entries;
  console.log('err: %s, files %s', err, files);
});
