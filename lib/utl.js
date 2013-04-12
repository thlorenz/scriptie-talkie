'use strict';

function typeFilter(keys, ctx, type) {

  return function (k, idx) {
    if (typeof ctx[k] === type) {
      keys.splice(idx, 1);
      return true;
    }
    return false;
  };
}

exports.printCtx = function (ctx) {

  var keys = Object.keys(ctx);

  var objects = keys.filter(typeFilter(keys, ctx, 'object'));
  var functions = keys.filter(typeFilter(keys, ctx, 'function'));


  objects = objects.sort();
  functions = functions.sort();
  keys = keys.sort();

  var s = '';
  s += '  // ---- objects ---';
  objects.forEach(function (o) { s += "  , '" + o + "'\n"; });

  s += '  // ---- functions ---';
  functions.forEach(function (o) { s += "  , '" + o + "'\n"; });

  s += '  // ---- keys ---';
  keys.forEach(function (o) { s += "  , '" + o + "'\n"; });
  console.log(s);
};
