'use strict';
/*jshint asi: true */

+function () {
  
// require is not available in browser
if (process.browser) return;

var test     =  require('tape')
  , talk     =  require('..')
  , fs       =  require('fs')
  , writeln  =  require('./browser/writeln')


test('\n# local require in same dir\n', function (t) {
  writeln('*** ' + __filename + ' ***'); writeln(''); 

  var script = fs.readFileSync(__dirname + '/fixtures/local-require.js', 'utf-8')
  var lines = talk(script, __dirname + '/fixtures/local-require', { writeln: writeln });

  t.deepEqual(
      lines
    , [ '\u001b[90m1: \u001b[32mvar\u001b[39m \u001b[37mdep\u001b[39m \u001b[93m=\u001b[39m \u001b[37mrequire\u001b[39m\u001b[90m(\u001b[39m\u001b[92m\'./local-dep\'\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  dep: \u001b[34m\u001b[1m[Function]\u001b[0m\n',
        '\u001b[90m2: \u001b[37mdep\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m"ok"\u001b[0m\n' ]
    , 'is resolved and exported function can be executed'
  )
  t.end()
})

test('\n# local require in sub dir\n', function (t) {

  var script = fs.readFileSync(__dirname + '/fixtures/local-subdir-require.js', 'utf-8')
  var lines = talk(script, __dirname + '/fixtures/local-subdir-require', { writeln: writeln });

  t.deepEqual(
      lines
    , [ '\u001b[90m1: \u001b[32mvar\u001b[39m \u001b[37mdep\u001b[39m \u001b[93m=\u001b[39m \u001b[37mrequire\u001b[39m\u001b[90m(\u001b[39m\u001b[92m\'./subdir/local-sub-dep\'\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[92m+\u001b[39m  dep: \u001b[34m\u001b[1m[Function]\u001b[0m\n',
        '\u001b[90m2: \u001b[37mdep\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)\u001b[39m\u001b[90m;\u001b[39m',
        '\u001b[36m=>\u001b[39m \u001b[34m\u001b[1m"sub ok"\u001b[0m\n' ]
    , 'is resolved and exported function can be executed'
  )
  t.end()
})

}()
