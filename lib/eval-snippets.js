'use strict';

var vm             =  require('vm')
  , clone          =  require('clone')
  , deepEqual      =  require('deep-equal')
  , requireLike    =  require('require-like')
  , path           =  require('path')
  , runner         =  require('./runner-vm')
  , colors         =  require('ansicolors')
  , ErrorIndicator =  colors.red('!')
  ;

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

function evalNextSnippet(remainingSnippets, ctx, onAllSnippetsEvaluated) {
  var snippet = remainingSnippets.shift();

  var prevCtx  =  clone(ctx) 
    , prevKeys =  Object.keys(prevCtx);

  function onSnippetEvaluated(crntCtx, nextCallback) {
    var keys             =  Object.keys(crntCtx)
      , addedValues      =  added(prevKeys, keys)
      , addedKeyValues   =  keyValues(addedValues, crntCtx)
      , changedValues    =  changed(crntCtx, prevCtx, prevKeys)
      , changedKeyValues =  keyValues(changedValues, crntCtx, prevCtx);

    if (snippet) {
      snippet.evaluated = {
          result  :  result
        , ctx     :  prevCtx 
        , added   :  addedKeyValues
        , changed :  changedKeyValues
      };
    }
    return remainingSnippets.length 
      ? process.nextTick(evalNextSnippet.bind(null, remainingSnippets, ctx, onAllSnippetsEvaluated)) 
      : onAllSnippetsEvaluated();
  }
  
  var result;
  try {
    result = runner.runInCtx(snippet.code, ctx);
  } catch (e) {
    ctx[ErrorIndicator] = e.toString();
  }
  var crntCtx = clone(ctx);

  onSnippetEvaluated(crntCtx, ctx._cb);
  delete ctx._cb;
  delete ctx[ErrorIndicator];
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
 * @param cb {Function} Called after all snippets were evalutated with {Object} the context after the last snippet was evaluated.
 */
module.exports = function evalSnippets(snippets, fullSrcPath, cb) {

  var sandbox =  createSandbox(fullSrcPath);
  var ctx     =  runner.createCtx(sandbox);

  var nonEmptySnippets = snippets
    .filter(function (snippet) { 
      return snippet.code.length; 
    });

  var fndecs = nonEmptySnippets
    .filter(function (snippet, idx) { 
      var firstStatement = snippet.ast.body && snippet.ast.body[0] && snippet.ast.body[0];
      if (!firstStatement || firstStatement.type !== 'FunctionDeclaration') return false;

      // ensure function declarations don't get evaluated twice
      nonEmptySnippets.splice(idx, 1);
      return true;
    });

  evalNextSnippet(fndecs, ctx,  function (err) {
    if(err) cb(err);
    evalNextSnippet(nonEmptySnippets, ctx, cb.bind(null, ctx));
  });
};
