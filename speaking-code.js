'use strict';
var fs         =  require('fs')
  , path       =  require('path')
  , highlight  =  require('cardinal').highlight
  , chunkify   =  require('./lib/chunkify')
  , evalChunks =  require('./lib/eval-chunks')
  , resolveTales = require('./lib/resolve-tales')
  ;

var script = fs.readFileSync(path.join(__dirname, 'examples', 'changing-var.js'), 'utf-8');

var chunked = chunkify(script);

evalChunks(chunked.chunks);

var tales = resolveTales(chunked.chunks);

var highlightedLines = highlight(script, { linenos: true }).split('\n')
  , offset = 0;

tales
  .forEach(function (x) {
    highlightedLines.splice(x.insertAfter + offset, 0, x.tale);
    offset++;
  });

highlightedLines = highlightedLines.filter(function (x) { return x.length; });

console.log(highlightedLines.join('\n'));
