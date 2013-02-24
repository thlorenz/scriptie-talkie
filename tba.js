'use strict';
var fs         =  require('fs')
  , path       =  require('path')
  , format     =  require('util').format
  , highlight  =  require('cardinal').highlight
  , chunkify   =  require('./lib/chunkify')
  , evalChunks =  require('./lib/eval-chunks')
  ;

function valueToString(value) {
  return typeof value !== 'object' ? value : JSON.stringify(value);
}

function keyValuesToString(keyValues) {
  return keyValues
    .map(function (x) { 
      return format('[ %s = %s ]', x.key, valueToString(x.value));
    })
    .join(' ');
}

var script = fs.readFileSync(path.join(__dirname, 'examples', 'objects.js'), 'utf-8');

var chunked = chunkify(script);

var ctx = evalChunks(chunked.chunks);

var currentLine = 1;
var enhancedCode = Object
  .keys(chunked.chunks)
  .map(function (k) {
    var comment
      , commentStart =  '\t// '
      , chunk        =  chunked.chunks[k]
      , res          =  chunk.evaluated
      , nextLine     =  chunk.end
      , code         =  chunked.lines.slice(currentLine - 1, nextLine).join('\n');

    currentLine = nextLine + 1;

    if (!res) return code;
    if (res.added.length) comment = (comment || commentStart) + ' + ' + keyValuesToString(res.added);
    if (res.changed.length) comment = (comment || commentStart) + ' ~ ' + keyValuesToString(res.changed);
    if (res.result) comment = (comment || commentStart) + ' => ' + valueToString(res.result);
    return code + comment;
  })
  .join('\n');

console.log(highlight(enhancedCode, { linenos: true }));
