'use strict';
/*jshint asi: true */

var test    =  require('tape') 
  , through =  require('through')
  , talk    =  require('..')

var scriptPath =  require.resolve('../examples/function-call-before-declaration')
  , script     =  require('fs').readFileSync(scriptPath, 'utf-8')

test('\n# function-call-before-declaration\n', function (t) {
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
      , [ 'var a = 1;',
          '\u001b[92m+\u001b[39m  a: \u001b[34m\u001b[1m1\u001b[0m',
          '',
          'foo();',
          '\u001b[94m~\u001b[39m  a: \u001b[34m\u001b[1m2\u001b[0m',
          '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m1\u001b[0m',
          '',
          'function foo () {',
          '  return a++;',
          '}',
          '\u001b[92m+\u001b[39m  foo: \u001b[34m\u001b[1m[Function: foo]\u001b[0m',
          '',
          'foo() + 1;',
          '\u001b[94m~\u001b[39m  a: \u001b[34m\u001b[1m3\u001b[0m',
          '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m3\u001b[0m',
          '' ]      
        , 'evaluates function declaration snippet first, so it can called earlier in the script'
    )
    t.end()
  }
})
