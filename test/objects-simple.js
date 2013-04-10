'use strict';
/*jshint asi: true */

var test    =  require('tap').test
  , through =  require('through')
  , talk    =  require('..')

var scriptPath =  require.resolve('../examples/objects-simple')
  , script     =  require('fs').readFileSync(scriptPath, 'utf-8')

test('\n# objects simple\n', function (t) {
  var lines = talk(script, scriptPath);

  t.deepEqual(
      lines
    , [ '\u001b[90m1: \u001b[39m\u001b[32mvar\u001b[39m \u001b[37mo\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37ma\u001b[39m\u001b[93m:\u001b[39m \u001b[34m1\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  o: {\u001b[32m\u001b[1m\n  "a" : 1\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\n',
        '\u001b[90m2: \u001b[39m',
        '\u001b[90m3: \u001b[39m\u001b[37mo\u001b[39m\u001b[32m.\u001b[39m\u001b[37ma\u001b[39m \u001b[93m=\u001b[39m \u001b[34m2\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[94m~\u001b[39m  o: {\n  "a" : \u001b[34m\u001b[1m2\u001b[0m\u001b[36m\u001b[1m // != 1\u001b[0m\n}\u001b[90m\n--------\n\u001b[39m\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m2\u001b[0m\n' ]
    , 'shows diffs of object properties'
  )
  t.end()
})
