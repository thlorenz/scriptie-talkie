#!/usr/bin/env node

var talk       =  require('..')
  , fs         =  require('fs')
  , through    =  require('through')
  , args       =  process.argv;

function printUsage() {
 var msg = [ 
      ''
    , 'Usage: scriptie-talkie <filename.js>'
    , ''
    , 'Unix Pipe Example: curl https://raw.github.com/thlorenz/ansicolors/master/ansicolors.js | scriptie-talkie'
    , ''
  ].join('\n');
  console.error(msg);
  process.exit(1);
}

if (args.length > 3) return printUsage();

// file
var scriptPath =  process.argv[2];
if (scriptPath) {
  var script = fs.readFileSync(scriptPath, 'utf-8');
  return talk(script, scriptPath);
}

// pipe
var data = '';
process.stdin.pipe(through(ondata, onend));

function ondata(data_) {
  data += data_;
}
function onend() {
  talk(data, null);
}
