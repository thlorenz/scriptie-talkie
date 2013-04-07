'use strict';
/*jshint asi: true */

var test    =  require('tape')
  , through =  require('through')
  , talk    =  require('..')

var scriptPath =  require.resolve('../examples/changing-var')
  , script     =  require('fs').readFileSync(scriptPath, 'utf-8')

test('\n# changing var\n', function (t) {
  var lines = talk(
      script    
    , scriptPath
    , { toLines : function (script) { return script.split('\n') } }
  );

  console.log(lines.join('\n'));

  t.deepEqual(
      lines
    , [ 'var a = 3;',
        '\u001b[92m+\u001b[39m  a: \u001b[34m\u001b[1m3\u001b[0m',
        '',
        'a = a + 1;',
        '\u001b[94m~\u001b[39m  a: \u001b[34m\u001b[1m4\u001b[0m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m4\u001b[0m',
        '',
        'a++;',
        '\u001b[94m~\u001b[39m  a: \u001b[34m\u001b[1m5\u001b[0m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m4\u001b[0m',
        '',
        'var b = 2;',
        '\u001b[92m+\u001b[39m  b: \u001b[34m\u001b[1m2\u001b[0m',
        '',
        'b = b + a;',
        '\u001b[94m~\u001b[39m  b: \u001b[34m\u001b[1m7\u001b[0m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m7\u001b[0m',
        '' ]
    , 'shows intermediate results'
  )
  t.end()
})
