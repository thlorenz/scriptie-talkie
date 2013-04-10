'use strict';

var diffValues =  require('./diff-values')
  , format     =  require('util').format
  , colors     =  require('ansicolors')
  ;

function formatAdd(key, value, diffopts) {
  return format('%s  %s: %s', colors.brightGreen('+'), key, diffValues({}, value, diffopts));
}

function formatChange(key, prevValue, value, diffopts) {
  return format('%s  %s: %s', colors.brightBlue('~'), key, diffValues(prevValue, value, diffopts));
}

function formatResult(result, diffopts) {
  return format('%s %s', colors.cyan('=>'), diffValues({}, result, diffopts));
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
        tales.push(opts.formatAdd(x.key, x.value, opts.diff));
      });
  }

  if (evaluated.changed.length) {
    evaluated.changed
      .forEach(function (x) {
        tales.push(opts.formatChange(x.key, x.prevValue, x.value, opts.diff));
      });
  }

  if (typeof evaluated.result !== 'undefined') 
    tales.push(opts.formatResult(evaluated.result, opts.diff));

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
