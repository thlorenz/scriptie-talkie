'use strict';
/*jshint asi: true */

var test    =  require('tape')
  , through =  require('through')
  , talk    =  require('..')

var scriptPath =  require.resolve('../examples/function-call-before-declaration')
  , script     =  require('fs').readFileSync(scriptPath, 'utf-8')

test('\n# function-call-before-declaration\n', function (t) {
  var lines = talk(script, scriptPath);

  t.deepEqual(
      lines
    , [ '\u001b[90m1: \u001b[39m\u001b[32mvar\u001b[39m \u001b[37ma\u001b[39m \u001b[93m=\u001b[39m \u001b[34m1\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  a: \u001b[34m\u001b[1m1\u001b[0m\n',
        '\u001b[90m2: \u001b[39m\u001b[37mfoo\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[94m~\u001b[39m  a: \u001b[34m\u001b[1m2\u001b[0m\n\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m1\u001b[0m\n',
        '\u001b[90m3: \u001b[39m',
        '\u001b[90m4: \u001b[39m\u001b[94mfunction\u001b[39m \u001b[37mfoo\u001b[39m \u001b[90m(\u001b[39m\u001b[90m)\u001b[39m \u001b[33m{\u001b[39m',
        '\u001b[90m5: \u001b[39m  \u001b[31mreturn\u001b[39m \u001b[37ma\u001b[39m\u001b[93m++\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[90m6: \u001b[39m\u001b[33m}\u001b[39m',
        '\u001b[92m+\u001b[39m  foo: \u001b[34m\u001b[1m[Function: foo]\u001b[0m\n',
        '\u001b[90m7: \u001b[39m\u001b[37mfoo\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m \u001b[93m+\u001b[39m \u001b[34m1\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[94m~\u001b[39m  a: \u001b[34m\u001b[1m3\u001b[0m\n\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m3\u001b[0m\n' ]
      , 'evaluates function declaration snippet first, so it can called earlier in the script'
  )
  t.end()
})
