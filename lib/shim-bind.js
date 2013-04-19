'use strict';

if (!Function.prototype.bind) {
  Function.prototype.bind = function (this_) {
    if (typeof this !== "function") {
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
 
    var args   =  Array.prototype.slice.call(arguments, 1)
      , fn     =  this
      , Noop   =  function () {}
      , fnbound =  function () {
        return fn.apply(this instanceof Noop && this_ ? this : this_, args.concat(Array.prototype.slice.call(arguments)));
      };
 
    Noop.prototype = this.prototype;
    fnbound.prototype = new Noop();
 
    return fnbound;
  };
}
