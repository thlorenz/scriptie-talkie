'use strict';

var browserify =  require('browserify')
  , shim       =  require('browserify-shim')
  , uglify     =  require('uglify-js')
  , path       =  require('path')
  , fs         =  require('fs');

function minify(code) {
  var compressor = uglify.Compressor()
    , ast = uglify.parse(code);

  ast.figure_out_scope();
  return ast.transform(compressor).print_to_string();
}

shim(browserify(), {
     ace       :  { path :  require.resolve('./ace/ace')               ,  exports: 'ace' }
  ,  acemode   :  { path :  require.resolve('./ace/mode-javascript')   ,  exports: null }
  ,  acetheme  :  { path :  require.resolve('./ace/theme-monokai')     ,  exports: null }
  })
  .transform('brfs')  
  .require(require.resolve('./main'), { entry: true })
  .bundle(function (err, src) {
    if (err) return console.error(err);
    var minified = minify(src);
    fs.writeFileSync(path.join(__dirname, '../../js', 'bundle.js'), minified);
  });
