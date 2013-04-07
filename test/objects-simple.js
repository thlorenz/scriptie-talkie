'use strict';
/*jshint asi: true */

var test    =  require('tap').test
  , through =  require('through')
  , talk    =  require('..')

var scriptPath =  require.resolve('../examples/objects-simple')
  , script     =  require('fs').readFileSync(scriptPath, 'utf-8')

test('\n# objects simple\n', function (t) {
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
      , [ 'var o = { a: 1 };',
          '\u001b[92m+\u001b[39m  o: {\u001b[32m\u001b[1m"a" : 1\u001b[0m\u001b[36m\u001b[1m \u001b[0m }',
          '',
          'o.a = 2;',
          '\u001b[94m~\u001b[39m  o: {"a" : \u001b[34m\u001b[1m2\u001b[0m\u001b[36m\u001b[1m // != 1\u001b[0m }',
          '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m2\u001b[0m',
          '' ]
      , 'shows diffs of object properties'
    )
    t.end()
  }
})
