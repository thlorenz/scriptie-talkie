'use strict';

var diffValues =  require('./diff-values')
  , format     =  require('util').format
  , colors     =  require('ansicolors')
  ;

function formatAdd(key, value) {
  return format('%s  %s: %s', colors.brightGreen('+'), key, diffValues({}, value));
}

function formatChange(key, prevValue, value) {
  return format('%s  %s: %s', colors.brightBlue('~'), key, diffValues(prevValue, value));
}

function formatResult(result) {
  return format('%s %s', colors.cyan('=>'), diffValues({}, result));
}

function formatSectionEnd(multiLine, lastOne) {
  return !multiLine || lastOne ? '\n' : colors.brightBlack('\n--------\n');
}

function resolveTale(evaluated, opts) {
  if (!evaluated) return '';

  var taleEnd =  '\n'
    , tales = [];

  if (evaluated.added.length) {
    evaluated.added
      .forEach(function (x) {
        tales.push(opts.formatAdd(x.key, x.value));
      });
  }

  if (evaluated.changed.length) {
    evaluated.changed
      .forEach(function (x) {
        tales.push(opts.formatChange(x.key, x.prevValue, x.value));
      });
  }

  if (evaluated.result) 
    tales.push(opts.formatResult(evaluated.result));

  return tales
    .reduce(
        function (s, tale, idx, all) {
          var lastOne = idx === (all.length - 1)
            , multiLine = ~tale.indexOf('\n');
          return s + tale + opts.formatSectionEnd(multiLine, lastOne); 
        }
      , ''
    );
}

module.exports = function resolveTales(snippets, opts) {
  opts = opts || {};
  opts.formatAdd        =  opts.formatAdd        || formatAdd;
  opts.formatChange     =  opts.formatChange     || formatChange;
  opts.formatResult     =  opts.formatResult     || formatResult;
  opts.formatSectionEnd =  opts.formatSectionEnd || formatSectionEnd;

  return snippets
    .map(function (snippet) {
      var tale = resolveTale(snippet.evaluated, opts);
      return {
          tale: tale
        , insertAfter: snippet.end
      };

    });
};
