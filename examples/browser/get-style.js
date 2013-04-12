'use strict';
/*jshint browser: true */

module.exports = function getStyle(el, prop) {
  return el.currentStyle
    ? el.currentStyle[prop]
    : window.getComputedStyle 
      ? document.defaultView.getComputedStyle(el, null).getPropertyValue(prop)
      : null;
};
