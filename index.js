'use strict';
var highlight    =  require('cardinal').highlight
  , snippetify   =  require('snippetify')
  , evalSnippets =  require('./lib/eval-snippets')
  , resolveTales =  require('./lib/resolve-tales')
  ;

function highlightLines(script) {
  return highlight(script, { linenos: true }).split('\n');
}

/**
 * Evaluates all snippets in the given script and calls opts.write with the result.
 * 
 * @name exports
 * @function
 * @param script {String} The String to evaluate.
 * @param scriptPath {String} The path to the script (important to resolve require statements)
 * @param opts {Object} { 
 *    toLines: function(code:String) -> [String] - to split script into lines -- uses cardinal syntax highlighter by default
 *    write  : function(result:String) - to be called to write the result -- default console.log
 */
module.exports = function (script, scriptPath, opts) {
  opts = opts || {};
  var toLines =  opts.toLines || highlightLines
    , write   =  opts.write   || console.log;

  var snippets = snippetify(script);

  var ctx = evalSnippets(snippets, scriptPath);
  var tales = resolveTales(snippets);

  var lines = toLines(script) 
    , offset = 0;

  tales
    .forEach(function (x) {
      lines.splice(x.insertAfter + offset, 0, x.tale);
      offset++;
    });

  lines = lines.filter(function (x) { return x.length; });

  write(lines.join('\n')); 
};
