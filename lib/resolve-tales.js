'use strict';

var diffValues =  require('./diff-values')
  , format     =  require('util').format;

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

module.exports = function resolveTales(chunks) {
  return chunks
    .map(function (chunk) {
      var tale = resolveTale(chunk.evaluated);
      return {
          tale: tale
        , insertAfter: chunk.end
      };

    });
};
