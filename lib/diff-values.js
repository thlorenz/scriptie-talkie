'use strict';

var difflet = require('difflet')
  , diff = difflet({
      indent : 2 
    , comma : 'first'
    , comment: true
    });

var dp = module.exports = function diffValues(before, after) {
  return diff
    .compare(before, after)
    // remove comments for added values
    .replace(/\/\/ != undefined/g, '');
};
