'use strict';
var scriptieTalkie = require('../../');

var term = require('hypernal')(100, 80);
term.appendTo('#terminal');

var lines = scriptieTalkie('"use strict";\nvar a = 4;\nvar b = a++; var o = {};\no.c = a + b;');
lines.forEach(function (line) { term.writeln(line); });
