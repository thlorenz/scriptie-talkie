'use strict';
/*jshint browser: true */

var qs = require('querystring');

exports.parse = function () {
  var query = window.location.search.substring(1);
  return qs.parse(query).code;
};

exports.stringify = function (code) {
  return qs.stringify({ code: code });
};
