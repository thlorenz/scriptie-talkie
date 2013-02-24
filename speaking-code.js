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

  var taleStart =  '\n'
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
