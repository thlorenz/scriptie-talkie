'use strict';
/*global ace */
/*jshint browser: true */

var scriptieTalkie =  require('../../')
  , debounce       =  require('debounce')
  , ua             =  require('useragent-wtf')
  , query          =  require('./query')
  , codeLink       =  document.getElementById('code-link')
  , codeTweet      =  document.getElementById('code-tweet')
  , root           =  getRoot()
  ;

function evaluateScript() {
  var script = editor.getValue();
  updateLinkAndTweet(script);
  term.reset();
  if (!script.trim().length) return;
  try { 
    scriptieTalkie(script)
      .forEach(function (line) { term.writeln(line); });
  } catch (e) {
    console.log(e.stack);
    console.error(e.toString());
    if (e instanceof ReferenceError && /Trying to access object from destroyed plug-in/.test(e.message)) {
      var msg = 'Looks like your iPad Safari browser doesn\'t like what scriptie talkie is doing.\n'
              + 'Please try another device and/or browser, i.e. chrome works everywhere, even on iPad.';
      term.writeln(msg);
    }
    else if (e.inner) {
      term.writeln('unable to parse the current code, looks like you have an error on: ');
      term.writeln('line: ' + e.inner.lineNumber + ' column: ' + e.inner.column);
    } else {
      term.writeln(e.toString());
      term.writeln(e.stack);
    }
    
  } 
}

function getRoot() {
  var loc = window.location;
  return loc.protocol + '//' + loc.host + loc.pathname;
}

function updateLinkAndTweet(code) {
  var link = root + '?' + query.stringify({ code: code });
  codeLink && codeLink.setAttribute && codeLink.setAttribute('href', link);

  if (codeTweet && codeTweet.setAttribute) {
      codeTweet.setAttribute('data-text', "I just created this interesting #JavaScript using @thl0's scriptie-talkie:");
      codeTweet.setAttribute('data-url', link);
  }
}

function initScript() {
  var parsed = query.parse();
  var code = (parsed && parsed.code) || require('./default-sample');

  if (code.charAt(code.length - 1) === '/') code = code.substring(0, code.length - 1);

  editor.setValue(code);
  updateLinkAndTweet(code);
}

var term = require('hypernal')(104, 80);
term.appendTo('#terminal');

var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.$highlightActiveLine = false;

initScript();

editor.on('change', debounce(evaluateScript, 400, false));
evaluateScript();
