'use strict';
/*global ace */
/*jshint browser: true */

var scriptieTalkie =  require('../../')
  , debounce       =  require('debounce')
  , query          =  require('./query')
  , codeLink       =  document.getElementById('code-link')
  , codeTweet      =  document.getElementById('code-tweet')
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
  updateLinkAndTweet(script);
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
  return loc.protocol + '//' + loc.host + loc.pathname;
}

function updateLinkAndTweet(code) {
  var link = root + '?' + query.stringify(code);
  codeLink && codeLink.setAttribute && codeLink.setAttribute('href', link);

  if (codeTweet && codeTweet.setAttribute) {
      codeTweet.setAttribute('data-text', "I just created this interesting #JavaScript using @thl0's scriptie-talkie:\n\n" + link);
      codeTweet.setAttribute('data-url', link);
  }
}

function initScript() {
  var code = query.parse() || require('./default-sample');
  editor.setValue(code);
  updateLinkAndTweet(code);
}
