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
  t.deepEqual(
      lines
    , [ '\u001b[90m1: \u001b[32mvar\u001b[39m \u001b[37mbar\u001b[39m \u001b[93m=\u001b[39m \u001b[92m\'bar\'\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  bar: \u001b[34m\u001b[1m"bar"\u001b[0m\n',
        '\u001b[90m2: \u001b[32mvar\u001b[39m \u001b[37mfoo\u001b[39m \u001b[93m=\u001b[39m \u001b[37mbar\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  foo: \u001b[34m\u001b[1m"bar"\u001b[0m\n',
        '\u001b[90m3: ',
        '\u001b[90m4: \u001b[94mfunction\u001b[39m \u001b[37mgetFooAndBar\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m \u001b[33m{\u001b[39m',
        '\u001b[90m5:   \u001b[31mreturn\u001b[39m \u001b[37mfoo\u001b[39m \u001b[93m+\u001b[39m \u001b[37mbar\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[90m6: \u001b[33m}\u001b[39m',
        '\u001b[92m+\u001b[39m  getFooAndBar: \u001b[34m\u001b[1m[Function: getFooAndBar]\u001b[0m\n',
        '\u001b[90m7: ',
        '\u001b[90m8: \u001b[37mgetFooAndBar\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m"barbar"\u001b[0m\n' ]
      )
  t.end()
})
