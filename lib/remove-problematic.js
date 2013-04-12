'use strict';

var exclude = {};

module.exports = function(thing, exclude_) {
  var t = {};
  var ex = exclude_ || exclude;
  if (!thing) return t;

  Object.keys(thing)
    .filter(function(k) { return !ex[k]; })
    .forEach(function (k) { if (thing.hasOwnProperty(k)) t[k] = thing[k]; });
  return t;
};

[   'top'
  , 'Intl'
  , 'chrome'
  , 'document'
  , 'external'
  , 'v8Intl'
  , 'window'

  // safari
  , 'frameElement'
  , 'parent'
].forEach(function (k) { exclude[k] = true; });

