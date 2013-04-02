'use strict';
/*jshint asi: true */

var test    =  require('tape') 
  , through =  require('through')
  , talk    =  require('..')

var scriptPath =  require.resolve('../examples/error')
  , script     =  require('fs').readFileSync(scriptPath, 'utf-8')

test('\n# error\n', function (t) {
  talk(
      script    
    , scriptPath
    , { toLines : function (script) { return script.split('\n') }
      , write   : write 
      }
  );

  function write(data) {
    console.log(data);

    t.deepEqual(
        data.split('\n')
      , [ 'var a = 3;',
          '\u001b[92m+\u001b[39m  a: \u001b[34m\u001b[1m3\u001b[0m',
          '',
          'a + b;',
          '\u001b[92m+\u001b[39m  \u001b[31m!\u001b[39m: \u001b[34m\u001b[1m"ReferenceError: b is not defined"\u001b[0m',
          '',
          'var b = 2;',
          '\u001b[92m+\u001b[39m  b: \u001b[34m\u001b[1m2\u001b[0m',
          '',
          'console.log(b.hello());',
          '\u001b[92m+\u001b[39m  \u001b[31m!\u001b[39m: \u001b[34m\u001b[1m"TypeError: Object 2 has no method \'hello\'"\u001b[0m',
          '' ]
      , 'shows intermediate results and shows exceptions'
    )
    t.end()
  }
});
