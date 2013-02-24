'use strict';

var parse = require('esprima').parse;

// XXX: could be separate module that finds smallest chunks that are parsable
module.exports = function chunkify(script) {
  // TODO: chunkify algorithm needs lots of improvement i.e handle comma-first
  var chunks = []
    , lines = script.split('\n')
    , lineno = 0;

  function nextChunk(code) {
    lineno++;
    var nextLine = lines.shift();

    code = code + nextLine;
    try {
      parse(code);
      return code;
    } catch(e) {
      return nextChunk(code + '\n');
    }
  }

  while (lines && lines.length) {
    var chunkStart = lineno + 1
      , chunk = nextChunk('');

    chunks.push({ start: chunkStart, end: lineno, code: chunk });
  }
  return { chunks: chunks, lines: script.split('\n') };
};
