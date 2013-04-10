'use strict';
/*jshint asi: true */

var test    =  require('tap').test
  , talk    =  require('..')

var scriptPath =  require.resolve('./fixtures/return-value-false')
  , script     =  require('fs').readFileSync(scriptPath, 'utf-8')

test('\n# return value false\n', function (t) {
  var lines = talk(script, scriptPath);

  t.deepEqual(
      lines
    , [ '\u001b[90m1: \u001b[39m\u001b[32mvar\u001b[39m \u001b[37ma\u001b[39m \u001b[93m=\u001b[39m \u001b[91mfalse\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  a: \u001b[34m\u001b[1mfalse\u001b[0m\n' ]
    , 'shows intermediate results'
  )
  t.end()
})
