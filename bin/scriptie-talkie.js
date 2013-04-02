#!/usr/bin/env node

var talk       =  require('..')
  , fs         =  require('fs')
  , scriptPath =  process.argv[2];

if (!scriptPath) {
  console.log('Usage: scriptie-talkie path/to/script.js');
  process.exit(1);
}

var script = fs.readFileSync(scriptPath, 'utf-8');
talk(script, scriptPath);
