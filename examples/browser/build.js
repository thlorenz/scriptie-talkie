var browserify =  require('browserify')
  , shim       =  require('browserify-shim')
  , path       =  require('path')
  , fs         =  require('fs')
  , aceroot    =  path.join(__dirname, 'ace');


var bundle = module.exports = function () {
  var bundle = shim(browserify(), {
       ace       :  { path :  require.resolve('./ace/ace')               ,  exports: 'ace' }
    ,  acemode   :  { path :  require.resolve('./ace/mode-javascript')   ,  exports: null }
    ,  acetheme  :  { path :  require.resolve('./ace/theme-monokai')     ,  exports: null }
    })
    .transform('brfs')
    .require(require.resolve('./main'), { entry: true })
    .bundle({ debug: true });

  return bundle;
};

if (!module.parent)
  bundle().pipe(fs.createWriteStream(__dirname + '/bundle.js'));
