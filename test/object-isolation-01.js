'use strict';
/*jshint asi: true */

var test    =  require('tap').test
  , talk    =  require('..')

var scriptPath =  require.resolve('./fixtures/object-isolation-01')
  , script     =  require('fs').readFileSync(scriptPath, 'utf-8')

test('\n# object isolation\n', function (t) {
  var lines = talk(script, scriptPath);

  t.deepEqual(
      lines
    , [ '\u001b[90m1: \u001b[39m\u001b[32mvar\u001b[39m \u001b[37mo\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37mfoo\u001b[39m\u001b[93m:\u001b[39m \u001b[33m{\u001b[39m\u001b[33m}\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  o: {\u001b[32m\u001b[1m"foo" : \n  {  }\u001b[0m\u001b[36m\u001b[1m \u001b[0m }\n',
        '\u001b[90m2: \u001b[39m\u001b[32mvar\u001b[39m \u001b[37mbar\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m\u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  bar: { }\n',
        '\u001b[90m3: \u001b[39m',
        '\u001b[90m4: \u001b[39m\u001b[37mbar\u001b[39m\u001b[32m.\u001b[39m\u001b[37mname\u001b[39m \u001b[93m=\u001b[39m \u001b[92m\'hey\'\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[94m~\u001b[39m  bar: {\u001b[32m\u001b[1m"name" : "hey"\u001b[0m\u001b[36m\u001b[1m \u001b[0m }\n\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m"hey"\u001b[0m\n',
        '\u001b[90m5: \u001b[39m\u001b[37mo\u001b[39m\u001b[32m.\u001b[39m\u001b[37mfoo\u001b[39m\u001b[32m.\u001b[39m\u001b[37mbar\u001b[39m \u001b[93m=\u001b[39m \u001b[37mbar\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[94m~\u001b[39m  o: {"foo" : \n  { \u001b[32m\u001b[1m"bar" : \n    { "name" : "hey"    }\u001b[0m\u001b[36m\u001b[1m \u001b[0m } }\u001b[90m\n--------\n\u001b[39m\u001b[36m=>\u001b[39m {\u001b[32m\u001b[1m"name" : "hey"\u001b[0m\u001b[36m\u001b[1m \u001b[0m }\n' ]
    , 'shows object changes without future changes affecting previous ones'
  )
  t.end()
})
