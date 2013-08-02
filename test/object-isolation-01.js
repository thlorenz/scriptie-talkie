'use strict';
/*jshint asi: true */

var test    =  require('tape')
  , through =  require('through')
  , talk    =  require('..')
  , fs      =  require('fs')
  , writeln =  require('./browser/writeln')

var script = fs.readFileSync(__dirname + '/fixtures/object-isolation-01.js', 'utf-8')

test('\n# object isolation\n', function (t) {
  writeln('*** ' + __filename + ' ***'); writeln(''); 

  var lines = talk(script, __dirname + '/fixtures/object-isolation-01', { writeln: writeln });

  t.deepEqual(
      lines
    , [ '\u001b[90m1: \u001b[32mvar\u001b[39m \u001b[37mo\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37mfoo\u001b[39m\u001b[93m:\u001b[39m \u001b[33m{\u001b[39m\u001b[33m}\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  o: {\u001b[32m\u001b[1m\n  "foo" : {\n  }\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\n',
        '\u001b[90m2: \u001b[32mvar\u001b[39m \u001b[37mbar\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m\u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  bar: {\n}\n',
        '\u001b[90m3: ',
        '\u001b[90m4: \u001b[37mbar\u001b[39m\u001b[32m.\u001b[39m\u001b[37mname\u001b[39m \u001b[93m=\u001b[39m \u001b[92m\'hey\'\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[94m~\u001b[39m  bar: {\u001b[32m\u001b[1m\n  "name" : "hey"\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\u001b[90m\n--------\n\u001b[39m\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m"hey"\u001b[0m\n',
        '\u001b[90m5: \u001b[37mo\u001b[39m\u001b[32m.\u001b[39m\u001b[37mfoo\u001b[39m\u001b[32m.\u001b[39m\u001b[37mbar\u001b[39m \u001b[93m=\u001b[39m \u001b[37mbar\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[94m~\u001b[39m  o: {\n  "foo" : {\u001b[32m\u001b[1m\n    "bar" : {\n      "name" : "hey" \n    }\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n  }\n}\u001b[90m\n--------\n\u001b[39m\u001b[36m=>\u001b[39m {\u001b[32m\u001b[1m\n  "name" : "hey"\u001b[0m\u001b[36m\u001b[1m \u001b[0m\n}\n' ]
    , 'shows object changes without future changes affecting previous ones'
  )
  t.end()
})

