var browserify =  require('browserify')
  , path       =  require('path')
  , fs         =  require('fs')
  , aceroot    =  path.join(__dirname, 'ace');


var bundle = module.exports = function () {
  var bundle = browserify() 
    .require(require.resolve('./main'), { entry: true })
    .bundle({ debug: true });

  return bundle;
};

if (!module.parent)
  bundle().pipe(fs.createWriteStream(__dirname + '/bundle.js'));
