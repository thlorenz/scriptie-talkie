'use strict';
var fs           =  require('fs')
  , path         =  require('path')
  , highlight    =  require('cardinal').highlight
  , snippetify   =  require('snippetify')
  , evalSnippets =  require('./lib/eval-snippets')
  , resolveTales =  require('./lib/resolve-tales')
  ;

// var script = fs.readFileSync(path.join(__dirname, 'examples', 'function-call.js'), 'utf-8');
var script = fs.readFileSync(require.resolve('./lib/diff-values'), 'utf-8');

var snippets = snippetify(script);

// TODO: This could also become a separate module with a starting context
evalSnippets(snippets,require.resolve('./lib/diff-values'));

var tales = resolveTales(snippets);

var highlightedLines = highlight(script, { linenos: true }).split('\n')
  , offset = 0;

tales
  .forEach(function (x) {
    highlightedLines.splice(x.insertAfter + offset, 0, x.tale);
    offset++;
  });

highlightedLines = highlightedLines.filter(function (x) { return x.length; });

console.log(highlightedLines.join('\n'));
