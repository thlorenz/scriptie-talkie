var o = { a: 1, a: 2 };

function strictOn() {
  'use strict';
  return { a: 1, a: 2 };
}

o
strictOn();
