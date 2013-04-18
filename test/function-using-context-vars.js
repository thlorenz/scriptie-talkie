'use strict';
/*jshint asi: true */

var test    =  require('tape')
  , through =  require('through')
  , talk    =  require('..')

var scriptPath =  require.resolve('./fixtures/function-using-context-vars')
  , script     =  require('fs').readFileSync(scriptPath, 'utf-8')


test('\n# function-using-context-vars\n', function (t) {
  var lines = talk(script, scriptPath);
  t.end()
})
