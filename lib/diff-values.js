'use strict';

var difflet = require('difflet')
  , prettydiff  =  difflet({ comment: true , indent: 2 })
  , compactdiff =  difflet({ comment:  true })
  ;

function newlinesIn(src) {
  if (!src) return 0;
  var newlines = src.match(/\n/g);

  return newlines ? newlines.length : 0;
}

module.exports = function diffValues(before, after, opts) {
  opts = opts || {};

  var joinLinesAt   =  opts.joinLinesAt   || 20
    , maxLineLength =  opts.maxLineLength || 380;

  var result = prettydiff.compare(before, after); 
  
  if (newlinesIn(result) >= joinLinesAt) result = compactdiff.compare(before, after);

  return result
    .split('\n')
    .map(function (line) {
      return line.length >= maxLineLength 
        ? line.slice(0, maxLineLength) + '....' 
        : line;
    })
    .join('\n')
    // remove comments for added values
    .replace(/\/\/ != undefined/g, '');
};
