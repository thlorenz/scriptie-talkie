'use strict';
var vm = require('vm');

exports.createCtx = function (sandbox) { 
  return vm.createContext(sandbox);
};

exports.runInCtx = function (code, ctx) {
  return vm.runInContext(code, ctx);
};
