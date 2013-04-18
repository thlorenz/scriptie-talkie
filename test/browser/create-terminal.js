'use strict';
/*jshint browser: true */

module.exports = function () {
  if (!process.browser) return function (s) { process.stdout.write(s + '\n'); };

  var terminal = document.getElementById('terminal');
  var term = require('hypernal')(60, 100);
  term.appendTo(terminal);
  return term.writeln.bind(term);
};
