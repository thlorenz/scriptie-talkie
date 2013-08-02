'use strict';
/*jshint asi: true */

var test    =  require('tape')
  , through =  require('through')
  , talk    =  require('..')
  , fs      =  require('fs')
  , writeln =  require('./browser/writeln')

var script = fs.readFileSync(__dirname + '/fixtures/strict-global.js', 'utf-8')

test('\n# strict global\n', function (t) {
  writeln('*** ' + __filename + ' ***'); writeln(''); 

  var lines = talk(script, __dirname + '/fixtures/strict-global', { writeln: writeln });

  t.deepEqual(
      lines
    , [ '\u001b[90m 1: \u001b[92m\'use strict\'\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m"use strict"\u001b[0m\n',
        '\u001b[90m 2: ',
        '\u001b[90m 3: \u001b[32mvar\u001b[39m \u001b[37mo\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37ma\u001b[39m\u001b[93m:\u001b[39m \u001b[34m1\u001b[39m\u001b[32m,\u001b[39m \u001b[37ma\u001b[39m\u001b[93m:\u001b[39m \u001b[34m2\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  \u001b[31m!\u001b[39m: \u001b[34m\u001b[1m"Error: Line 1: Duplicate data property in object literal not allowed in strict mode"\u001b[0m\n',
        '\u001b[90m 4: ',
        '\u001b[90m 5: \u001b[94mfunction\u001b[39m \u001b[37mfoo\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m \u001b[33m{\u001b[39m',
        '\u001b[90m 6:   \u001b[31mreturn\u001b[39m \u001b[33m{\u001b[39m \u001b[37ma\u001b[39m\u001b[93m:\u001b[39m \u001b[34m1\u001b[39m\u001b[32m,\u001b[39m \u001b[37ma\u001b[39m\u001b[93m:\u001b[39m \u001b[34m2\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[90m 7: \u001b[33m}\u001b[39m',
        '\u001b[92m+\u001b[39m  \u001b[31m!\u001b[39m: \u001b[34m\u001b[1m"Error: Line 2: Duplicate data property in object literal not allowed in strict mode"\u001b[0m\n',
        '\u001b[90m 8: ',
        '\u001b[90m 9: \u001b[37mo\u001b[39m',
        '\u001b[92m+\u001b[39m  \u001b[31m!\u001b[39m: \u001b[34m\u001b[1m"ReferenceError: o is not defined"\u001b[0m\n',
        '\u001b[90m10: \u001b[37mfoo\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  \u001b[31m!\u001b[39m: \u001b[34m\u001b[1m"ReferenceError: foo is not defined"\u001b[0m\n' ]
      , 'shows global strict violation at root level and inside function and violating var and function remain undefined'
  )
  t.end()
})
