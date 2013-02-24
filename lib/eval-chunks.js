'use strict';
var vm = require('vm');

function extra(origKeys, keys) {
  return keys 
    .filter(function (k) { 
      return !(~origKeys.indexOf(k));
    });
}

function added(prevCtx, ctx) {
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

module.exports = function evalChunks(chunks) {
  var sandbox = {}
    , ctx = vm.createContext(sandbox);

  chunks
    .filter(function (x) { return x.code.length; })
    .forEach(function (x) {
      var prevKeys     =  Object.keys(ctx)
        , prevCtxJson  =  JSON.stringify(ctx)
        , prevCtx      =  JSON.parse(prevCtxJson)

        // TODO: error handling
        , result       =  vm.runInContext(x.code, ctx)

        , ctxJson      =  JSON.stringify(ctx)
        , parsedCtx    =  JSON.parse(ctxJson)
        , addedProps   =  keyValues(extra(prevKeys, Object.keys(parsedCtx)), parsedCtx)
        , changedProps =  keyValues(added(prevCtx, parsedCtx), parsedCtx)
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
};
