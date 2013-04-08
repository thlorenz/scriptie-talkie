'use strict';
/*global ace */
/*jshint browser: true */

var scriptieTalkie =  require('../../')
  , debounce       =  require('debounce')
  , query          =  require('./query')
  , codeLink       =  document.getElementById('code-link')
  , root           =  getRoot()
  ;

var term = require('hypernal')(104, 80);
term.appendTo('#terminal');

var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.on('change', debounce(evaluateScript, 400, false));
editor.$highlightActiveLine = false;

window.editor = editor;
evaluateScript();

initScript();

function evaluateScript() {
  var script = editor.getValue();
  updateLink(script);
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

function getRoot() {
  var loc = window.location;
  return loc.origin + loc.host + loc.pathname;
}

function updateLink(code) {
  codeLink && codeLink.setAttribute && codeLink.setAttribute('href', root + '?' + query.stringify(code));
}

function initScript() {
  var code = query.parse() || require('./default-sample');
  editor.setValue(code);
  updateLink(code);
}
