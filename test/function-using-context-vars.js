'use strict';
/*jshint asi: true */

var test    =  require('tape')
  , through =  require('through')
  , talk    =  require('..')
  , fs      =  require('fs')
  , writeln =  require('./browser/writeln')

var script = fs.readFileSync(__dirname + '/fixtures/function-using-context-vars.js', 'utf-8')

test('\n# function-using-context-vars\n', function (t) {
  writeln('*** ' + __filename + ' ***'); writeln(''); 

  var lines = talk(script, __dirname + '/fixtures/function-using-context-vars.js', { writeln: writeln });
  t.end()
})
