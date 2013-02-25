'use strict';

var diffValues =  require('./diff-values')
  , format     =  require('util').format;

function formatAdd(key, value) {
  return format('+ %s: %s', key, diffValues({}, value));
}

function formatChange(key, prevValue, value) {
  return format('~ %s: %s', key, diffValues(prevValue, value));
}

function formatResult(result) {
  return format('=> %s', diffValues({}, result));
}

function resolveTale(evaluated, opts) {
  if (!evaluated) return '';

  var taleEnd =  '\n'
    , tale = '';

  function addTale(s) {
    tale += (s + taleEnd);
  }

  if (evaluated.added.length) {
    evaluated.added
      .forEach(function (x) {
        addTale(opts.formatAdd(x.key, x.value));
      });
  }

  if (evaluated.changed.length) {
    evaluated.changed
      .forEach(function (x) {
        addTale(opts.formatChange(x.key, x.prevValue, x.value));
      });
  }

  if (evaluated.result) 
    addTale(opts.formatResult(evaluated.result));

  return tale;
}

module.exports = function resolveTales(chunks, opts) {
  opts = opts || {};
  opts.formatAdd    =  opts.formatAdd    || formatAdd;
  opts.formatChange =  opts.formatChange || formatChange;
  opts.formatResult =  opts.formatResult || formatResult;

  return chunks
    .map(function (chunk) {
      var tale = resolveTale(chunk.evaluated, opts);
      return {
          tale: tale
        , insertAfter: chunk.end
      };

    });
};
