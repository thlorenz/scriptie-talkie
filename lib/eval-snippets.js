'use strict';

var vm = require('vm')
  , contextify = require('contextify')
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

function removePropertiesThatCauseStackOverflowInDeepEqual(sandbox) {
  function downsizeProcess(process) {
    [ 'stdout'
    , 'stderr'
    , 'stdin'
    , 'mainModule'
    ].forEach(function (k) { delete process[k]; });
  }

  [ 'root'
  , 'global'
  , 'GLOBAL'
  ].forEach(function (x) { delete sandbox[x]; });

  downsizeProcess(sandbox.process);
}

function createSandbox(fullSrcPath) {
  var sandbox = clone(global);

  removePropertiesThatCauseStackOverflowInDeepEqual(sandbox);

  sandbox.module = { exports: { }, parent: null };
  if (fullSrcPath) {
    sandbox.require    =  requireLike(fullSrcPath);
    sandbox.__filename =  fullSrcPath;
    sandbox.__dirname  =  path.dirname(fullSrcPath);
  }
  return sandbox;
}

/**
 * Evaluates the code of each snippet and attaches an 'evaluated' property to it which contains:
 *    result:   returned value when snippet's code was evaluated
 *    ctx:      the context after the code was evaluated
 *    added:    properties that were added during code evaluation
 *    changed:  properties that were changed during code evaluation
 * 
 * A common context is used for all snippets, so if a previous snippet defines a property, it will
 * be available to the next snippet.
 *
 * @name evalsnippets
 * @function
 * @param snippets {Array{Object}} Whose code {String} will be evaluated.
 * @param fullPath {String} The full path to the file that contained all snippets. Used to make relative require statements work.
 * @return {Object} The context after the last snippet was evaluated.
 */
module.exports = function evalSnippets(snippets, fullSrcPath) {
  var sandbox = createSandbox(fullSrcPath)
    //, ctx = vm.createContext(sandbox);
    , ctx = contextify.createContext(sandbox);

  snippets
    .filter(function (snippet) { return snippet.code.length; })
    .forEach(function (snippet) {
      var prevCtx  =  clone(ctx) 
        , prevKeys =  Object.keys(prevCtx);

      // TODO: error handling -> set error as result
      // var result = vm.runInContext(snippet.code, ctx);
      var result = ctx.run(snippet.code);
        

      var crntCtx          =  clone(ctx)
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
