'use strict';
var timeoutRes
  , secondTimeoutRes;

setTimeout(function () {
  timeoutRes = 'timed out';
  secondTimeout();
}, 10);

function secondTimeout() {
  setTimeout(function () {
    secondTimeoutRes = 'timed out again';
    console.log(timeoutRes);
  }, 10);
}
