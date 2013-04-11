var browserify = require('browserify')
  , fs = require('fs');

var bundle = module.exports = function () {
  return browserify()
    .require(require.resolve('./main'), { entry: true })
    .bundle({ debug: true });
};

if (!module.parent)
  bundle().pipe(fs.createWriteStream(__dirname + '/bundle.js'));
