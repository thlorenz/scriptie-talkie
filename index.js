'use strict';
require('./lib/shim-bind');

var highlight    =  require('cardinal').highlight
  , snippetify   =  require('snippetify')
  , evalSnippets =  require('./lib/eval-snippets')
  , resolveTales =  require('./lib/resolve-tales')
  , browser      =  process.browser
  ;

function highlightLines(script) {
  return highlight(script, { linenos: true }).split('\n');
}

/**
 * Evaluates all snippets in the given script and calls opts.writeln with each line of the result.
 * 
 * @name exports
 * @function
 * @param script {String} The String to evaluate.
 * @param scriptPath {String} The path to the script (important to resolve require statements)
 * @param opts {Object} { 
 *    toLines: function(code:String) -> [String] - to split script into lines -- uses cardinal syntax highlighter by default
 *    write  : function(result:String) - to be called to write the result -- default console.log
 *    diff   : { joinLinesAt: at what point is diff compacted to one line      
 *             , maxLineLength: at which length is a diff line cut off with an ellipsis
 *             }
 * @return {Array[String]} The result split into lines.
 */
var talk = module.exports = function (script, scriptPath, opts) {
  opts = opts || {};
  var toLines =  opts.toLines || highlightLines
    , writeln =  opts.writeln || (process.browser === true ? function () {} : console.log.bind(console));

  var snippets = snippetify(script, { nonstrict: true });

  var ctx = evalSnippets(snippets, scriptPath, opts.diff);
  var tales = resolveTales(snippets, opts);

  var lines = toLines(script) 
    , offset = 0;

  tales
    .forEach(function (x, idx) {
      if (!x.tale.length) return;
      lines.splice(x.insertAfter + offset++, 0, x.tale);
    });

  lines = lines.filter(function (x) { return x.length; });

  lines.forEach(function (line) { writeln(line); });

  return lines;
};
