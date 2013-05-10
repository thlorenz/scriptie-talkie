'use strict';
/*jshint browser: true */

+function () {

if (!process.browser) 
  return module.exports = function (s) { process.stdout.write(s + '\n'); };

var terminal = document.createElement('div');
document.body.appendChild(terminal);

var term = require('hypernal')();
term.appendTo(terminal);
module.exports = term.writeln.bind(term);
}();
