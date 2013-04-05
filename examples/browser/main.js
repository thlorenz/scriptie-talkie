'use strict';
var scriptieTalkie = require('../../');

var term = require('hypernal')(100, 80);
term.appendTo('#terminal');

var lines = scriptieTalkie('var a = 4;\nvar b = a++;');
lines.forEach(function (line) { term.writeln(line); });
