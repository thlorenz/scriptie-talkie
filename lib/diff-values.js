'use strict';

var difflet = require('difflet')
  , prettydiff = difflet({ comment: true , indent: 2 })
  , compactdiff = difflet({ comment:  true })
  ;

function newlinesIn(src) {
  if (!src) return 0;
  var newlines = src.match(/\n/g);

  return newlines ? newlines.length : 0;
}

var dp = module.exports = function diffValues(before, after, maxlines) {
  maxlines = maxlines || 20;

  var result = prettydiff.compare(before, after); 
  
  if (newlinesIn(result) > maxlines) result = compactdiff.compare(before, after);
  
  return result
    // remove comments for added values
    .replace(/\/\/ != undefined/g, '');
};
