'use strict';
/*jshint asi: true */

var test    =  require('tap').test
  , through =  require('through')
  , talk    =  require('..')

var scriptPath =  require.resolve('../examples/error')
  , script     =  require('fs').readFileSync(scriptPath, 'utf-8')

test('\n# error\n', function (t) {
  var lines = talk(script, scriptPath);

  t.deepEqual(
      lines 
    , [ '\u001b[90m1: \u001b[39m\u001b[32mvar\u001b[39m \u001b[37ma\u001b[39m \u001b[93m=\u001b[39m \u001b[34m3\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  a: \u001b[34m\u001b[1m3\u001b[0m\n',
        '\u001b[90m2: \u001b[39m',
        '\u001b[90m3: \u001b[39m\u001b[37ma\u001b[39m \u001b[93m+\u001b[39m \u001b[37mb\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  \u001b[31m!\u001b[39m: \u001b[34m\u001b[1m"ReferenceError: b is not defined"\u001b[0m\n',
        '\u001b[90m4: \u001b[39m',
        '\u001b[90m5: \u001b[39m\u001b[32mvar\u001b[39m \u001b[37mb\u001b[39m \u001b[93m=\u001b[39m \u001b[34m2\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  b: \u001b[34m\u001b[1m2\u001b[0m\n',
        '\u001b[90m6: \u001b[39m',
        '\u001b[90m7: \u001b[39m\u001b[34mconsole\u001b[39m\u001b[32m.\u001b[39m\u001b[34mlog\u001b[39m\u001b[90m(\u001b[39m\u001b[37mb\u001b[39m\u001b[32m.\u001b[39m\u001b[37mhello\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  \u001b[31m!\u001b[39m: \u001b[34m\u001b[1m"TypeError: Object 2 has no method \'hello\'"\u001b[0m\n' ]
    , 'shows intermediate results and shows exceptions'
  )
  t.end()
});
