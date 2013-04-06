'use strict';

exports.clean = function(thing, exclude) {
  var t = {};
  if (!thing) return t;

  Object.keys(thing)
    .filter(function(k) { return !exclude[k]; })
    .forEach(function (k) { if (thing[k]) t[k] = thing[k]; });
  return t;
};
