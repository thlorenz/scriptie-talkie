'use strict';
/*jshint asi: true */

var test =  require('tape')
  , talk =  require('..')
  , fs   =  require('fs')
  , writeln  =  require('./browser/writeln')

var script = fs.readFileSync(__dirname + '/fixtures/bug-coercion-NaN-to-undefined.js', 'utf-8')

// see: https://github.com/thlorenz/scriptie-talkie/issues/1
// appearently this is only broken in the browser implementation since this test passed without change
test('\n# ensuring that NaN is not coerced to undefined\n', function (t) {
  writeln('*** ' + __filename + ' ***'); writeln(''); 

  var lines = talk(script, __dirname + '/fixtures/bug-coercion-NaN-to-undefined', { writeln: writeln });

  t.deepEqual(
      lines
    , ["\u001b[90m1: \u001b[32mvar\u001b[39m \u001b[37mx\u001b[39m \u001b[93m=\u001b[39m \u001b[34m1\u001b[39m \u001b[93m+\u001b[39m \u001b[90mundefined\u001b[39m \u001b[93m+\u001b[39m \u001b[34m1\u001b[39m\u001b[90m;\u001b[39m"
      ,"\u001b[92m+\u001b[39m  x: \u001b[34m\u001b[1mNaN\u001b[0m\n"
      ,"\u001b[90m2: \u001b[94mtypeof\u001b[39m\u001b[90m(\u001b[39m\u001b[37mx\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m"
      ,"\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m\"number\"\u001b[0m\n"]
    , 'shows intermediate results'
  )
  t.end()
})
