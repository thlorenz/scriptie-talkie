var fs = require('fs')
  , path = require('path')
  , vm = require('vm')
  , parse = require('esprima').parse
  ;

// line by line, try to find smallest block size that is evaluatable

var script = fs.readFileSync(path.join(__dirname, 'examples', 'changing-var.js'), 'utf-8');

function chunkify(script) {
  var chunks = []
    , lines = script.split('\n')
    , lineno = 0;

  function nextChunk(code) {
    lineno++;
    code += lines.shift();
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
  return chunks;
}

function extra(origKeys, keys) {
  return keys 
    .filter(function (k) { 
      return !(~origKeys.indexOf(k));
    });
}

function changed(prevCtx, ctx) {
  return Object.keys(prevCtx)
    .filter(function (k) {
      return prevCtx[k] !== ctx[k];
    });
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
        , addedProps   =  extra(prevKeys, Object.keys(parsedCtx))
        , changedProps =  changed(prevCtx, parsedCtx)
            .map(function (k) {
              return { key: k, value: parsedCtx[k] };
            })
        ;

      x.evaluated = {
          result  :  JSON.stringify(result)
        , ctx     :  ctxJson
        , added   :  JSON.stringify(addedProps)
        , changed :  JSON.stringify(changedProps)
      };
    });

  return ctx;
}

var chunks = chunkify(script);
var ctx = evaluate(chunks);
chunks;
