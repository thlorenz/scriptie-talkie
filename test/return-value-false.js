'use strict';
/*jshint asi: true */

var test    =  require('tape')
  , through =  require('through')
  , talk    =  require('..')
  , fs      =  require('fs')
  , writeln =  require('./browser/writeln')

var script = fs.readFileSync(__dirname + '/fixtures/return-value-false.js', 'utf-8')

test('\n# return value false\n', function (t) {
  writeln('*** ' + __filename + ' ***'); writeln(''); 

  var lines = talk(script, __dirname + '/fixtures/return-value-false', { writeln: writeln });

  t.deepEqual(
      lines
    , [ '\u001b[90m1: \u001b[32mvar\u001b[39m \u001b[37ma\u001b[39m \u001b[93m=\u001b[39m \u001b[91mfalse\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  a: \u001b[34m\u001b[1mfalse\u001b[0m\n',
        '\u001b[90m2: \u001b[37ma\u001b[39m \u001b[93m===\u001b[39m \u001b[91mfalse\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1mtrue\u001b[0m\n',
        '\u001b[90m3: \u001b[37ma\u001b[39m \u001b[93m!==\u001b[39m \u001b[91mfalse\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1mfalse\u001b[0m\n' ]
    , 'shows intermediate results'
  )
  t.end()
})
