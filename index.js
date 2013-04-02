'use strict';
var fs           =  require('fs')
  , path         =  require('path')
  , highlight    =  require('cardinal').highlight
  , snippetify   =  require('snippetify')
  , evalSnippets =  require('./lib/eval-snippets')
  , resolveTales =  require('./lib/resolve-tales')
  ;

function highlightLines(script) {
  return highlight(script, { linenos: true }).split('\n');
}

var talk = module.exports = function (script, scriptPath, opts) {
  opts = opts || {};
  var toLines =  opts.toLines || highlightLines
    , write   =  opts.write   || console.log;

  var snippets = snippetify(script);

  evalSnippets(snippets, scriptPath, function (ctx) {
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
  });
};

if (module.parent) return;

var scriptPath = process.argv[2] || path.join(__dirname, 'examples', 'error.js')
  , script = fs.readFileSync(scriptPath, 'utf-8');

talk(script, scriptPath);
