'use strict';
/*jshint asi: true */

var debug// =  true;
var test  =  debug  ? function () {} : require('tape')
var test_ =  !debug ? function () {} : require('tape')

var through =  require('through')
  , talk    =  require('..')
  , fs      =  require('fs')
  , writeln =  require('./browser/writeln')

var script = fs.readFileSync(__dirname + '/../examples/objects-simple.js', 'utf-8')


test('\n# compacting\n', function (t) {
  writeln('*** ' + __filename + ' ***'); writeln(''); 

  writeln('# compacting'); writeln(''); 
    
  var lines = talk(script, __dirname + '/../examples/objects-simple', { diff: { joinLinesAt: 2 }, writeln: writeln });

  t.deepEqual(
      lines
    , [ '\u001b[90m1: \u001b[32mvar\u001b[39m \u001b[37mo\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37ma\u001b[39m\u001b[93m:\u001b[39m \u001b[34m1\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  o: {\u001b[32m\u001b[1m"a":1\u001b[0m}\n',
        '\u001b[90m2: ',
        '\u001b[90m3: \u001b[37mo\u001b[39m\u001b[32m.\u001b[39m\u001b[37ma\u001b[39m \u001b[93m=\u001b[39m \u001b[34m2\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[94m~\u001b[39m  o: {"a":\u001b[34m\u001b[1m2\u001b[0m}\n\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m2\u001b[0m\n' ]
    , 'shows diffs of object properties compacted'
  )
  t.end()
})

test('\n# max line length\n', function (t) {
  writeln('# max line length'); writeln(''); 

  var lines = talk(script, __dirname + '/../examples/objects-simple', { diff: { maxLineLength: 20 }, writeln: writeln });

  t.deepEqual(
      lines
    , [ '\u001b[90m1: \u001b[32mvar\u001b[39m \u001b[37mo\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37ma\u001b[39m\u001b[93m:\u001b[39m \u001b[34m1\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  o: {\u001b[32m\u001b[1m\n  "a" : 1\u001b[0m\u001b[36m\u001b[....\n}\n',
        '\u001b[90m2: ',
        '\u001b[90m3: \u001b[37mo\u001b[39m\u001b[32m.\u001b[39m\u001b[37ma\u001b[39m \u001b[93m=\u001b[39m \u001b[34m2\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[94m~\u001b[39m  o: {\n  "a" : \u001b[34m\u001b[1m2\u001b[....\n}\u001b[90m\n--------\n\u001b[39m\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m2\u001b[0m\n' ]
    , 'shows diffs of object properties with lines cut off at length 20'
  )
  t.end()
})

test('\n# compacting and max line length\n', function (t) {
    
  writeln('# compacting and max line length'); writeln(''); 

  var lines = talk(script, __dirname + '/../examples/objects-simple', { diff: { joinLinesAt: 2, maxLineLength: 15 }, writeln: writeln });

  t.deepEqual(
      lines
    , [ '\u001b[90m1: \u001b[32mvar\u001b[39m \u001b[37mo\u001b[39m \u001b[93m=\u001b[39m \u001b[33m{\u001b[39m \u001b[37ma\u001b[39m\u001b[93m:\u001b[39m \u001b[34m1\u001b[39m \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  o: {\u001b[32m\u001b[1m"a":1....\n',
        '\u001b[90m2: ',
        '\u001b[90m3: \u001b[37mo\u001b[39m\u001b[32m.\u001b[39m\u001b[37ma\u001b[39m \u001b[93m=\u001b[39m \u001b[34m2\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[94m~\u001b[39m  o: {"a":\u001b[34m\u001b[1m2....\n\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m2\u001b[0m\n' ]
    , 'shows diffs of object properties compacted and lines cut off'
  )
  t.end()
})
