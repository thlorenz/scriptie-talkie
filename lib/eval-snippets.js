'use strict';

var browser = process.browser;

var vm                    =  require('vm')
  , clone                 =  require('clone')
  , deepIs                =  require('deep-is')
  , runner                =  require('./runner-vm')
  , colors                =  require('ansicolors')
  , parse                 =  require('esprima').parse
  , removeIFrameGenerated =  require('./remove-iframe-generated')
  , removeProblematic     =  require('./remove-problematic')
  , createSandbox         =  require('./create-sandbox')
  , ErrorIndicator        =  colors.red('!')
  , useStrictRx           =  /^ *['"]use strict['"]/
  ;

function isFunctionDeclaration(snippet) {
  var firstStatement = snippet.ast.body && snippet.ast.body[0] && snippet.ast.body[0];
  return firstStatement && firstStatement.type === 'FunctionDeclaration';
}

function added(origKeys, keys) {
  return keys 
    .filter(function (k) { 
      return !(~origKeys.indexOf(k));
    });
}

function changed(ctx, prevCtx, prevKeys) {
  return prevKeys
    .filter(function (k) {
      return !deepIs(prevCtx[k], ctx[k]);
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

function cleaned(ctx, add) {
  var cleanedCtx = removeProblematic(ctx);

  Object.keys(add).forEach(function (k) { cleanedCtx[k] = add[k]; });

  return cleanedCtx;
}

function evalSnippet(ctx, snippet, isStrict, allTrackedKeyValues) {
  if (browser) ctx = cleaned(ctx, allTrackedKeyValues);

  var prevCtx  =  clone(ctx)
    , prevKeys =  Object.keys(prevCtx)
    , code     =  snippet.code
    , result;


  try {
    if (isStrict && !useStrictRx.test(code)) { 
      // best way to enforce strict without breaking other things like function declarations (in the browser), etc.
      parse('"use strict";' + snippet.code);
    }

    result = runner.runInCtx(code, ctx);
  } catch (e) {
    ctx[ErrorIndicator] = e.toString();
  }

  if (browser) ctx = cleaned(ctx, {});

  var crntCtx          =  clone(ctx)
    , keys             =  Object.keys(crntCtx)
    , addedValues      =  added(prevKeys, keys);

  if (browser) addedValues = removeIFrameGenerated(addedValues);

  var addedKeyValues   =  keyValues(addedValues, crntCtx)
    , changedValues    =  changed(crntCtx, prevCtx, prevKeys)
    , changedKeyValues =  keyValues(changedValues, crntCtx, prevCtx);

  snippet.evaluated = {
      result  :  result
    , ctx     :  prevCtx 
    , added   :  clone(addedKeyValues)
    , changed :  clone(changedKeyValues)
  };

  if (browser) {
    addedKeyValues.concat(changedKeyValues).forEach(function (x) { 
      allTrackedKeyValues[x.key] = x.value; 
    });
    delete allTrackedKeyValues[ErrorIndicator];
  }

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
 * @return {Object} The context after the last snippet was evaluated.
 */
module.exports = function evalSnippets(snippets, fullSrcPath) {

  var sandbox             =  createSandbox(fullSrcPath);
  var ctx                 =  runner.createCtx(sandbox);
  var allTrackedKeyValues =  {};
  var fndecs;

  var nonEmptySnippets = snippets
    .filter(function (snippet) { 
      return snippet.code.length; 
    });

  var isStrict = nonEmptySnippets
    .some(function (snippet) {
      return useStrictRx.test(snippet.raw);
    });
  
  if (!browser) {
    fndecs = nonEmptySnippets
      .filter(function (snippet, idx) { 
        if (!isFunctionDeclaration(snippet)) return false;
        
        // ensure function declarations don't get evaluated twice
        nonEmptySnippets.splice(idx, 1);
        return true;
      });

    fndecs.forEach(function(snippet) { evalSnippet(ctx, snippet, isStrict, allTrackedKeyValues); });
  }

  nonEmptySnippets.forEach(function(snippet) { evalSnippet(ctx, snippet, isStrict, allTrackedKeyValues); });
  return ctx;
};
