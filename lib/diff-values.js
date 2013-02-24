'use strict';

var difflet = require('difflet')
  , diff = difflet({
      indent : 2 
    , comma : 'first'
    , comment: true
    });

var dp = module.exports = function diffProps(before, after) {
  return diff
    .compare(before, after)
    // remove comments for added props
    .replace(/\/\/ != undefined/g, '');
};
