'use strict';
var fs         =  require('fs')
  , path       =  require('path')
  , format     =  require('util').format
  , highlight  =  require('cardinal').highlight
  , diffValues =  require('./lib/diff-values')
  , chunkify   =  require('./lib/chunkify')
  , evalChunks =  require('./lib/eval-chunks')
  ;

function valueToString(value) {
  return typeof value !== 'object' ? value : JSON.stringify(value);
}

function keyValuesToString(keyValues) {
  return keyValues
    .map(function (x) { 
      return format('[ %s = %s ]', x.key, valueToString(x.value));
    })
    .join(' ');
}

var script = fs.readFileSync(path.join(__dirname, 'examples', 'changing-var.js'), 'utf-8');

var chunked = chunkify(script);

evalChunks(chunked.chunks);

function resolveTale(evaluated) {
  if (!evaluated) return '';

  var taleEnd =  '\n'
    , tale = '';

  function addToTale(s) {
    tale += (s + taleEnd);
  }

  if (evaluated.added.length) {
    evaluated.added
      .forEach(function (x) {
        var addTale = format('+ %s: %s', x.key, diffValues({}, x.value));
        addToTale(addTale);
      });
  }

  if (evaluated.changed.length) {
    evaluated.changed
      .forEach(function (x) {
        var changeTale = format('~ %s: %s', x.key, diffValues(x.prevValue, x.value));
        addToTale(changeTale);
      });
  }

  if (evaluated.result) 
    addToTale('=> ' + diffValues({}, evaluated.result));

  return tale;
}

function resolveTales(chunks) {
  return chunks
    .map(function (chunk) {
      var tale = resolveTale(chunk.evaluated);
      return {
          tale: tale
        , insertAfter: chunk.end
      };

    });
}

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

