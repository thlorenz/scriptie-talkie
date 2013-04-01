'use strict';
var fs           =  require('fs')
  , path         =  require('path')
  , highlight    =  require('cardinal').highlight
  , snippetify   =  require('snippetify')
  , evalSnippets =  require('./lib/eval-snippets')
  , resolveTales =  require('./lib/resolve-tales')
  ;

function highlightedLines(script) {
  return highlight(script, { linenos: true }).split('\n');
}

var talk = module.exports = function (script, opts) {
  opts         =  opts         || {};
  opts.out     =  opts.out     || process.stdout;
  opts.toLines =  opts.toLines || highlightedLines;

  var snippets = snippetify(script);

  evalSnippets(snippets, scriptPath, function (ctx) {
    var tales = resolveTales(snippets);

    var highlightedLines = opts.toLines(script) 
      , offset = 0;

    tales
      .forEach(function (x) {
        highlightedLines.splice(x.insertAfter + offset, 0, x.tale);
        offset++;
      });

    highlightedLines = highlightedLines.filter(function (x) { return x.length; });

    console.log(highlightedLines.join('\n'));
  });

};

if (module.parent) return;

var scriptPath = process.argv[2] || path.join(__dirname, 'examples', 'error.js')
  , script = fs.readFileSync(scriptPath, 'utf-8');

talk(script);
