'use strict';

var data = '';
var Stream = require('stream');
var stream = new Stream();
stream.readable =  true;
stream.writable =  true;
stream.write    =  function (buf) { data +=  buf; };

var charm = require('charm')(stream);

var difflet = require('difflet')
  , prettydiff = difflet({
      comment :  true
    , stream  :  stream
    , start   :  start
    , stop    :  stop
    , indent  :  2
    })
  , compactdiff = difflet({
      comment :  true
    , stream  :  stream
    , start   :  start
    , stop    :  stop
    })
  ;

function start (type) {
  var fg;
  switch(type) {
    case 'inserted': fg = 'green' ; break ;
    case 'updated' : fg = 'blue'  ; break ;
    case 'deleted' : fg = 'red'   ; break ;
    case 'comment' : fg = 'cyan'  ; break ;
  }
  charm.foreground(fg);
}

function stop (type) { 
  // show unchanged properties subdued
  charm.display('bright');
  charm.foreground('black');
}


function newlinesIn(src) {
  if (!src) return 0;
  var newlines = src.match(/\n/g);

  return newlines ? newlines.length : 0;
}


function diff(fn, before, after) {
  data = '';

  charm.display('bright');
  charm.foreground('black');
  fn(before, after);
  charm.display('reset');

  return data;
}

var dp = module.exports = function diffValues(before, after, maxlines) {
  maxlines = maxlines || 10;

  var result = diff(prettydiff, before, after); 
  
  if (newlinesIn(result) > maxlines) result = diff(compactdiff, before, after);
  
  // remove comments for added values
  return result.replace(/\/\/ != undefined/g, '');
};
