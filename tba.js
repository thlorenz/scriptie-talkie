'use strict';
var fs = require('fs')
  , path = require('path')
  , vm = require('vm')
  , format = require('util').format
  , parse = require('esprima').parse
  , highlight = require('cardinal').highlight
  ;

// line by line, try to find smallest block size that is evaluatable

var script = fs.readFileSync(path.join(__dirname, 'examples', 'objects.js'), 'utf-8');

function chunkify(script) {
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
}

function extra(origKeys, keys) {
  return keys 
    .filter(function (k) { 
      return !(~origKeys.indexOf(k));
    });
}

function changed(prevCtx, ctx) {
  return Object
    .keys(prevCtx)
    .filter(function (k) {
      return prevCtx[k] !== ctx[k] 
        && JSON.stringify(prevCtx[k]) !== JSON.stringify(ctx[k]);
    });
}

function keyValues(keys, ctx) {
  return keys.map(function (k) {
    return { key: k, value: ctx[k] };
  });
}

function valueToString(value) {
  return typeof value !== 'object' ? value : JSON.stringify(value);
}

function keyValuesToString(keyValues) {
  return keyValues
    .map(function (x) { 
      return format('[ %s = %s ]', x.key, valueToString(x.value));
    })
    .join(' ');
}

function evaluate(chunks) {
  var sandbox = {}
    , ctx = vm.createContext(sandbox);

  chunks
    .filter(function (x) { return x.code.length; })
    .forEach(function (x) {
      var prevKeys     =  Object.keys(ctx)
        , prevCtxJson  =  JSON.stringify(ctx)
        , prevCtx      =  JSON.parse(prevCtxJson)

        , result       =  vm.runInContext(x.code, ctx)

        , ctxJson      =  JSON.stringify(ctx)
        , parsedCtx    =  JSON.parse(ctxJson)
        , addedProps   =  keyValues(extra(prevKeys, Object.keys(parsedCtx)), parsedCtx)
        , changedProps =  keyValues(changed(prevCtx, parsedCtx), parsedCtx)
        ;

      x.evaluated = {
          result  :  result
        , ctx     :  parsedCtx
        , added   :  addedProps
        , changed :  changedProps
      };

      x.evaluatedJSON = {
          result  :  JSON.stringify(result)
        , ctx     :  ctxJson
        , added   :  JSON.stringify(addedProps)
        , changed :  JSON.stringify(changedProps)
      };
    });

  return ctx;
}

var chunked = chunkify(script);

var ctx = evaluate(chunked.chunks);

var currentLine = 1;
var enhancedCode = Object
  .keys(chunked.chunks)
  .map(function (k) {
    var comment
      , commentStart =  '\t// '
      , chunk        =  chunked.chunks[k]
      , res          =  chunk.evaluated
      , nextLine     =  chunk.end
      , code         =  chunked.lines.slice(currentLine - 1, nextLine).join('\n');

    currentLine = nextLine + 1;

    if (!res) return code;
    if (res.added.length) comment = (comment || commentStart) + ' + ' + keyValuesToString(res.added);
    if (res.changed.length) comment = (comment || commentStart) + ' ~ ' + keyValuesToString(res.changed);
    if (res.result) comment = (comment || commentStart) + ' => ' + valueToString(res.result);
    return code + comment;
  })
  .join('\n');

console.log(highlight(enhancedCode, { linenos: true }));
