'use strict';
/*global ace */
/*jshint browser: true */

var scriptieTalkie =  require('../../')
  , debounce       =  require('debounce');

var term = require('hypernal')(104, 80);
term.appendTo('#terminal');

var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.on('change', debounce(evaluateScript, 400, false));
editor.setValue(require('./default-sample'));
editor.$highlightActiveLine = false;

window.editor = editor;
evaluateScript();

function evaluateScript() {
  var script = editor.getValue();
  term.reset();
  if (!script.trim().length) return;
  try { 
    scriptieTalkie(script)
      .forEach(function (line) { term.writeln(line); });
  } catch (e) {
    term.writeln('unable to parse the current code, looks like you have an error on: ');
    term.writeln('line: ' + e.inner.lineNumber + ' column: ' + e.inner.column);
  } 
}
