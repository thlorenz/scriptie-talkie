'use strict';

var browser = process.browser;

// ensure that browserify doesn't try to include requirelike
var requireLikeName   =  'require-like'
  , requireLike       =  browser ? function () {} : require(requireLikeName)
  , path              =  require('path')
  , removeProblematic =  require('./remove-problematic')
  ;

function cleanProcess(process) {
  var exclude = {
      'stdout'     :  true
    , 'stderr'     :  true
    , 'stdin'      :  true
    , 'mainModule' :  true
  };

  return removeProblematic(process, exclude);
}

module.exports = function createSandbox(fullSrcPath) {
  var exports = { };
  var sandbox = { 
      console :  global.console
    , module  :  { exports :  exports , parent :  null }
    , exports :  exports
    , process :  cleanProcess(process) 
  };

  var serverside = {
    // server side only
      require           :  requireLike(fullSrcPath)
    , __filename        :  fullSrcPath
    , __dirname         :  path.dirname(fullSrcPath)

    , Buffer            :  require('buffer').Buffer
    , ArrayBuffer       :  global.ArrayBuffer
    , Int8Array         :  global.Int8Array
    , Uint8Array        :  global.Uint8Array
    , Uint8ClampedArray :  global.Uint8ClampedArray
    , Int16Array        :  global.Int16Array
    , Uint16Array       :  global.Uint16Array
    , Int32Array        :  global.Int32Array
    , Uint32Array       :  global.Uint32Array
    , Float32Array      :  global.Float32Array
    , Float64Array      :  global.Float64Array
    , DataView          :  global.DataView
  };

  if (!browser)
    Object.keys(serverside).forEach(function (k) { sandbox[k] = serverside[k]; });

  return sandbox;
};
