'use strict';

var vm = require('vm')
  , clone = require('clone')
  , deepEqual = require('deep-equal')
  , requireLike = require('require-like')
  , path = require('path');

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
 *  Evaluates the code of each snippet and attaches an 'evaluated' property to it which contains:
 *  result:   returned value when snippet's code was evaluated
 *  ctx:      the context after the code was evaluated
 *  added:    properties that were added during code evaluation
 *  changed:  properties that were changed during code evaluation
 * 
 * @name evalsnippets
 * @function
 * @param snippets {Array{Object}} Whose code will be evaluated.
 * @return {Object} The context after the last snippet was evaluated.
 */
module.exports = function evalSnippets(snippets, fullSrcPath) {
  var sandbox = fullSrcPath 
      ?  { require    :  requireLike(fullSrcPath)
          , __filename :  fullSrcPath
          , __dirname  :  path.dirname(fullSrcPath)
          
            // module.parent and such are out of scope for now
          , module: { exports: { } }
        }
      : { }
    , ctx = vm.createContext(sandbox);

  snippets
    .filter(function (snippet) { return snippet.code.length; })
    .forEach(function (snippet) {
      var prevCtx  =  clone(ctx) 
        , prevKeys =  Object.keys(prevCtx);

      // TODO: error handling -> set error as result
      var result = vm.runInContext(snippet.code, ctx);

      var crntCtx       =  clone(ctx)
        , keys             =  Object.keys(crntCtx)
        , addedValues      =  added(prevKeys, keys)
        , addedKeyValues   =  keyValues(addedValues, crntCtx)
        , changedValues    =  changed(crntCtx, prevCtx, prevKeys)
        , changedKeyValues =  keyValues(changedValues, crntCtx, prevCtx);


      snippet.evaluated = {
          result  :  result
        , ctx     :  prevCtx 
        , added   :  addedKeyValues
        , changed :  changedKeyValues
      };
    });

  return ctx;
};
