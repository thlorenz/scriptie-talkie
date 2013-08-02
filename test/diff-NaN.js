'use strict';
/*jshint asi: true */

var test    =  require('tape')
  , through =  require('through')
  , talk    =  require('..')
  , fs      =  require('fs')
  , writeln =  require('./browser/writeln')

var script = fs.readFileSync(__dirname + '/fixtures/diff-NaN.js', 'utf-8')

test('\n# diffing values that were NaN and still are NaN \n', function (t) {
  writeln('*** ' + __filename + ' ***'); writeln(''); 

  var lines = talk(script, __dirname + '/fixtures/diff-NaN', { writeln: writeln });

  t.deepEqual(
      lines
    , [ '\u001b[90m 1: \u001b[32mvar\u001b[39m \u001b[37ma\u001b[39m \u001b[93m=\u001b[39m \u001b[34m1\u001b[39m \u001b[93m+\u001b[39m \u001b[94mvoid\u001b[39m \u001b[93m+\u001b[39m \u001b[34m1\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  a: \u001b[34m\u001b[1mNaN\u001b[0m\n',
        '\u001b[90m 2: \u001b[94mtypeof\u001b[39m \u001b[37ma\u001b[39m \u001b[93m===\u001b[39m \u001b[92m\'undefined\'\u001b[39m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1mfalse\u001b[0m\n',
        '\u001b[90m 3: ',
        '\u001b[90m 4: \u001b[32mvar\u001b[39m \u001b[37mb\u001b[39m \u001b[93m=\u001b[39m \u001b[34m1\u001b[39m \u001b[93m+\u001b[39m \u001b[90mundefined\u001b[39m \u001b[93m+\u001b[39m \u001b[34m1\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  b: \u001b[34m\u001b[1mNaN\u001b[0m\n',
        '\u001b[90m 5: \u001b[94mtypeof\u001b[39m \u001b[37mb\u001b[39m \u001b[93m===\u001b[39m \u001b[92m\'undefined\'\u001b[39m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1mfalse\u001b[0m\n',
        '\u001b[90m 6: ',
        '\u001b[90m 7: \u001b[37mx\u001b[39m \u001b[93m=\u001b[39m \u001b[37mNaN\u001b[39m \u001b[93m+\u001b[39m \u001b[34m1\u001b[39m',
        '\u001b[92m+\u001b[39m  x: \u001b[34m\u001b[1mNaN\u001b[0m\n\u001b[36m=>\u001b[39m \u001b[34m\u001b[1mNaN\u001b[0m\n',
        '\u001b[90m 8: \u001b[94mtypeof\u001b[39m \u001b[37mx\u001b[39m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m"number"\u001b[0m\n',
        '\u001b[90m 9: ',
        '\u001b[90m10: \u001b[94mtypeof\u001b[39m \u001b[37mNaN\u001b[39m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m"number"\u001b[0m\n',
        '\u001b[90m11: ',
        '\u001b[90m12: \u001b[94mtypeof\u001b[39m \u001b[90m(\u001b[39m\u001b[37mNaN\u001b[39m \u001b[93m+\u001b[39m \u001b[92m""\u001b[39m\u001b[90m)\u001b[39m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m"string"\u001b[0m\n',
        '\u001b[90m13: ',
        '\u001b[90m14: \u001b[94mtypeof\u001b[39m \u001b[90m(\u001b[39m\u001b[34m1\u001b[39m \u001b[93m+\u001b[39m \u001b[94mvoid\u001b[39m \u001b[93m+\u001b[39m \u001b[34m1\u001b[39m\u001b[90m)\u001b[39m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m"number"\u001b[0m\n' ]   
    , 'shows diffs of object properties compacted'
  )
  t.end()
})

