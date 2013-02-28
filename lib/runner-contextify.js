'use strict';
var contextify = require('contextify');

exports.createCtx = function (sandbox) {
  contextify(sandbox);
  contextify.createContext(sandbox);
  // although we run code in context, contextify only manipulates the state of the sandbox, but not the context itself
  // therefore we use the sandbox itself as the context to check for updated properties
  return sandbox;
};

exports.runInCtx = function (code, ctx) {
  return ctx.run(code);
};
