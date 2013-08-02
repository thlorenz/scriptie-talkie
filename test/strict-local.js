'use strict';
/*jshint asi: true */

var test    =  require('tape')
  , through =  require('through')
  , talk    =  require('..')
  , fs      =  require('fs')
  , writeln =  require('./browser/writeln')

var script = fs.readFileSync(__dirname + '/fixtures/strict-local.js', 'utf-8')

test('\n# strict local\n', function (t) {
  writeln('*** ' + __filename + ' ***'); writeln(''); 

  var lines = talk(script, __dirname + '/fixtures/strict-local', { writeln: writeln });

  t.deepEqual(
      lines
    , [ '\u001b[90m1: \u001b[32mvar\u001b[39m \u001b[37mo\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37ma\u001b[39m\u001b[93m:\u001b[39m \u001b[34m1\u001b[39m\u001b[32m,\u001b[39m \u001b[37ma\u001b[39m\u001b[93m:\u001b[39m \u001b[34m2\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  o: {\u001b[32m\u001b[1m\n  "a" : 2\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\n',
        '\u001b[90m2: ',
        '\u001b[90m3: \u001b[94mfunction\u001b[39m \u001b[37mstrictOn\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m \u001b[33m{\u001b[39m',
        '\u001b[90m4:   \u001b[92m\'use strict\'\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[90m5:   \u001b[31mreturn\u001b[39m \u001b[33m{\u001b[39m \u001b[37ma\u001b[39m\u001b[93m:\u001b[39m \u001b[34m1\u001b[39m\u001b[32m,\u001b[39m \u001b[37ma\u001b[39m\u001b[93m:\u001b[39m \u001b[34m2\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[90m6: \u001b[33m}\u001b[39m',
        '\u001b[92m+\u001b[39m  \u001b[31m!\u001b[39m: \u001b[34m\u001b[1m"SyntaxError: Duplicate data property in object literal not allowed in strict mode"\u001b[0m\n',
        '\u001b[90m7: ',
        '\u001b[90m8: \u001b[37mo\u001b[39m',
        '\u001b[36m=>\u001b[39m {\u001b[32m\u001b[1m\n  "a" : 2\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\n',
        '\u001b[90m9: \u001b[37mstrictOn\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  \u001b[31m!\u001b[39m: \u001b[34m\u001b[1m"ReferenceError: strictOn is not defined"\u001b[0m\n' ]
      , 'shows local strict violation inside function and function remains undefined'
  )
  t.end()
})
