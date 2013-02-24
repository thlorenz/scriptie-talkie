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

var script = fs.readFileSync(path.join(__dirname, 'examples', 'objects-simple.js'), 'utf-8');

var chunked = chunkify(script);

evalChunks(chunked.chunks);

function resolveTale(evaluated) {
  if (!evaluated) return '';

  var taleStart =  '\n  '
    , tale = '';

  function addToTale(s) {
    tale += (taleStart + s);
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
console.log(tales.map(function (x) { return x.tale; }).join('') );

function enhanceCode () {
var currentLine = 1;
var enhancedCode = Object
  .keys(chunked.chunks)
  .map(function (k) {
    var taleStart =  '\n\t'
      , tale      =  taleStart 
      , chunk        =  chunked.chunks[k]
      , res          =  chunk.evaluated
      , nextLine     =  chunk.end
      , code         =  chunked.lines.slice(currentLine - 1, nextLine).join('\n');

    function addToTale(s) {
      tale += (taleStart + s);
    }

    currentLine = nextLine + 1;

    if (!res) return code;

    if (res.added.length) 
      addToTale('+  ' + keyValuesToString(res.added));

    if (res.changed.length) 
      addToTale('~  ' + keyValuesToString(res.changed));

    if (res.result) 
      addToTale('=> ' + valueToString(res.result));

    return code +  tale;
  })
  .join('\n');
}
