'use strict';

var browserify =  require('browserify')
  , uglify     =  require('uglify-js')
  , path       =  require('path')
  , fs         =  require('fs');

function minify(code) {
  var compressor = uglify.Compressor()
    , ast = uglify.parse(code);

  ast.figure_out_scope();
  return ast.transform(compressor).print_to_string();
}

browserify()
  .require(require.resolve('./main'), { entry: true })
  .bundle(function (err, src) {
    if (err) return console.error(err);
    var minified = minify(src);
    fs.writeFileSync(path.join(__dirname, '../../js', 'bundle.js'), minified);
  });
