'use strict';
/*jshint browser: true */

+function () {

if (!process.browser) return module.exports = function (s) { process.stdout.write(s + '\n'); };

var terminal = document.getElementById('terminal');
var term = require('hypernal')(60, 80);
term.appendTo(terminal);
module.exports = term.writeln.bind(term);

}();
