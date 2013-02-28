'use strict';
var contextify = require('contextify');

exports.createCtx = function (sandbox) {
  contextify(sandbox);
  contextify.createContext(sandbox);
  return sandbox.getGlobal();
};

exports.runInCtx = function (code, ctx) {
  return ctx.run(code);
};
