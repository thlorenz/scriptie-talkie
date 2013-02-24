'use strict';
var vm = require('vm')
  , clone = require('clone')
  , deepEqual = require('deep-equal');

function added(origKeys, keys) {
  return keys 
    .filter(function (k) { 
      return !(~origKeys.indexOf(k));
    });
}

function changed(ctx, prevCtx, prevKeys) {
  return prevKeys
    .filter(function (k) {
      return !deepEqual(prevCtx[k], ctx[k]);
    });
}

function keyValues(keys, ctx, prevCtx) {
  return keys.map(function (k) {
    return { 
        key       :  k
      , value     :  ctx[k]
      , prevValue :  prevCtx ? prevCtx[k] :  undefined
    };
  });
}

/**
 * Evaluates the code of each chunk and attaches an 'evaluated' property to it which contains:
 *  result:   returned value when chunk's code was evaluated
 *  ctx:      the context after the code was evaluated
 *  added:    properties that were added during code evaluation
 *  changed:  properties that were changed during code evaluation
 * 
 * @name evalChunks
 * @function
 * @param chunks {Object} Whose code will be evaluated.
 * @return {Object} The context after the last chunk was evaluated.
 */
module.exports = function evalChunks(chunks) {
  var sandbox =  {}
    , ctx     =  vm.createContext(sandbox)
    , prevCtx =  clone(ctx) ;

  chunks
    .filter(function (chunk) { return chunk.code.length; })
    .forEach(function (chunk) {
      var prevKeys     =  Object.keys(ctx);

      // TODO: error handling
      var result = vm.runInContext(chunk.code, ctx);

      var keys             =  Object.keys(ctx)
        , addedValues      =  added(prevKeys, keys)
        , addedKeyValues   =  keyValues(addedValues, ctx)
        , changedValues    =  changed(ctx, prevCtx, prevKeys)
        , changedKeyValues =  keyValues(changedValues, ctx, prevCtx);

        // sets previous context for next chunk
        prevCtx          =  clone(ctx) ;

      chunk.evaluated = {
          result  :  result
        , ctx     :  prevCtx 
        , added   :  addedKeyValues
        , changed :  changedKeyValues
      };
    });

  return ctx;
};
