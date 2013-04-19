'use strict';
/*jshint browser: true */

+function () {

if (!process.browser) return module.exports = function (s) { process.stdout.write(s + '\n'); };

var terminal = document.createElement('div');
document.body.appendChild(terminal);

var term = require('hypernal')(80, 80);
term.appendTo(terminal);
module.exports = function (s) { 
  term.writeln(s);
  // fix for the fact that hypernal doesn't interpret '\n' correctly at this point
  if (s.charAt(s.length - 1) === '\n') term.writeln(' ');
};
}();
